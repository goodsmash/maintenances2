import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { z } from 'zod';

const itemSchema = z.object({
  name: z.string().min(1),
  sku: z.string().min(1),
  category: z.string(),
  description: z.string(),
  quantity: z.number().min(0),
  unit: z.string(),
  minQuantity: z.number().min(0),
  maxQuantity: z.number().min(0),
  reorderPoint: z.number().min(0),
  cost: z.number().min(0),
  price: z.number().min(0),
  supplier: z.object({
    id: z.string(),
    name: z.string(),
    leadTime: z.number(),
  }),
  location: z.object({
    warehouse: z.string(),
    zone: z.string(),
    shelf: z.string(),
    bin: z.string(),
  }),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions);

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { route } = req.query;
  const routePath = Array.isArray(route) ? route.join('/') : route;

  try {
    switch (req.method) {
      case 'GET':
        switch (routePath) {
          case 'items':
            return await getItems(req, res);
          case 'alerts':
            return await getAlerts(req, res);
          case 'stock-counts':
            return await getStockCounts(req, res);
          case 'analytics':
            return await getAnalytics(req, res);
          default:
            return res.status(404).json({ error: 'Route not found' });
        }

      case 'POST':
        switch (routePath) {
          case 'items':
            return await createItem(req, res);
          case 'movements':
            return await recordMovement(req, res);
          case 'stock-counts':
            return await createStockCount(req, res);
          case 'reports':
            return await generateReport(req, res);
          default:
            return res.status(404).json({ error: 'Route not found' });
        }

      case 'PUT':
        switch (routePath) {
          case 'items':
            return await updateItem(req, res);
          case 'alerts':
            return await updateAlert(req, res);
          case 'settings':
            return await updateSettings(req, res);
          default:
            return res.status(404).json({ error: 'Route not found' });
        }

      case 'DELETE':
        switch (routePath) {
          case 'items':
            return await deleteItem(req, res);
          default:
            return res.status(404).json({ error: 'Route not found' });
        }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Inventory API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getItems(req: NextApiRequest, res: NextApiResponse) {
  const { category, status, search, page = 1, limit = 10 } = req.query;

  const where: any = {};

  if (category) {
    where.category = category;
  }

  if (status) {
    where.status = status;
  }

  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { sku: { contains: search as string, mode: 'insensitive' } },
      { description: { contains: search as string, mode: 'insensitive' } },
    ];
  }

  const items = await prisma.inventoryItem.findMany({
    where,
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
    include: {
      supplier: true,
      location: true,
    },
  });

  const total = await prisma.inventoryItem.count({ where });

  return res.status(200).json({
    items,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  });
}

async function createItem(req: NextApiRequest, res: NextApiResponse) {
  const validation = itemSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ error: validation.error });
  }

  const item = await prisma.inventoryItem.create({
    data: {
      ...validation.data,
      status: 'in_stock',
      createdBy: req.session!.user.id,
    },
    include: {
      supplier: true,
      location: true,
    },
  });

  return res.status(201).json(item);
}

async function updateItem(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const validation = itemSchema.partial().safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ error: validation.error });
  }

  const item = await prisma.inventoryItem.update({
    where: { id: id as string },
    data: validation.data,
    include: {
      supplier: true,
      location: true,
    },
  });

  return res.status(200).json(item);
}

async function deleteItem(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  await prisma.inventoryItem.delete({
    where: { id: id as string },
  });

  return res.status(204).end();
}

async function getAlerts(req: NextApiRequest, res: NextApiResponse) {
  const { type, severity, status } = req.query;

  const where: any = {};

  if (type) {
    where.type = type;
  }

  if (severity) {
    where.severity = severity;
  }

  if (status) {
    where.status = status;
  }

  const alerts = await prisma.inventoryAlert.findMany({
    where,
    orderBy: { date: 'desc' },
    include: {
      item: true,
    },
  });

  return res.status(200).json(alerts);
}

async function recordMovement(req: NextApiRequest, res: NextApiResponse) {
  const { itemId, type, quantity, reference, notes } = req.body;

  const movement = await prisma.inventoryMovement.create({
    data: {
      itemId,
      type,
      quantity,
      reference,
      notes,
      performedBy: req.session!.user.id,
    },
  });

  // Update item quantity
  await prisma.inventoryItem.update({
    where: { id: itemId },
    data: {
      quantity: {
        increment: type === 'received' ? quantity : -quantity,
      },
    },
  });

  return res.status(201).json(movement);
}

async function createStockCount(req: NextApiRequest, res: NextApiResponse) {
  const { type, items, notes } = req.body;

  const stockCount = await prisma.stockCount.create({
    data: {
      type,
      status: 'in_progress',
      items: {
        create: items.map((item: any) => ({
          itemId: item.id,
          expectedQuantity: item.quantity,
          actualQuantity: 0,
          discrepancy: 0,
        })),
      },
      notes,
      assignedTo: {
        connect: { id: req.session!.user.id },
      },
    },
    include: {
      items: {
        include: {
          item: true,
        },
      },
    },
  });

  return res.status(201).json(stockCount);
}

async function getStockCounts(req: NextApiRequest, res: NextApiResponse) {
  const { status, type, startDate, endDate } = req.query;

  const where: any = {};

  if (status) {
    where.status = status;
  }

  if (type) {
    where.type = type;
  }

  if (startDate && endDate) {
    where.startDate = {
      gte: new Date(startDate as string),
      lte: new Date(endDate as string),
    };
  }

  const stockCounts = await prisma.stockCount.findMany({
    where,
    include: {
      items: {
        include: {
          item: true,
        },
      },
      assignedTo: true,
      completedBy: true,
    },
  });

  return res.status(200).json(stockCounts);
}

async function generateReport(req: NextApiRequest, res: NextApiResponse) {
  const { type, dateRange, filters, format } = req.body;

  // Implementation depends on reporting requirements
  // This is a placeholder that returns basic inventory data
  const data = await prisma.inventoryItem.findMany({
    where: {
      createdAt: {
        gte: new Date(dateRange.start),
        lte: new Date(dateRange.end),
      },
    },
    include: {
      movements: true,
      supplier: true,
      location: true,
    },
  });

  // Format data based on report type and requested format
  // This is a simplified example
  const report = {
    type,
    dateRange,
    filters,
    data,
    generatedBy: req.session!.user.id,
    generatedAt: new Date(),
  };

  return res.status(200).json(report);
}

async function getAnalytics(req: NextApiRequest, res: NextApiResponse) {
  const { metrics, startDate, endDate, groupBy } = req.query;

  const analytics: any = {
    totalItems: await prisma.inventoryItem.count(),
    totalValue: await prisma.inventoryItem.aggregate({
      _sum: {
        quantity: true,
        price: true,
      },
    }),
    lowStockItems: await prisma.inventoryItem.count({
      where: {
        quantity: {
          lte: prisma.raw('reorder_point'),
        },
      },
    }),
    movements: await prisma.inventoryMovement.groupBy({
      by: ['type'],
      _count: true,
      where: {
        date: {
          gte: new Date(startDate as string),
          lte: new Date(endDate as string),
        },
      },
    }),
  };

  if (groupBy === 'category') {
    analytics.byCategory = await prisma.inventoryItem.groupBy({
      by: ['category'],
      _count: true,
      _sum: {
        quantity: true,
        price: true,
      },
    });
  }

  return res.status(200).json(analytics);
}

async function updateAlert(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const { status } = req.body;

  const alert = await prisma.inventoryAlert.update({
    where: { id: id as string },
    data: { status },
    include: {
      item: true,
    },
  });

  return res.status(200).json(alert);
}

async function updateSettings(req: NextApiRequest, res: NextApiResponse) {
  const { settings } = req.body;

  // Update settings in database or configuration
  // This is a placeholder implementation
  const updatedSettings = settings;

  return res.status(200).json(updatedSettings);
}
