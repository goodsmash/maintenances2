import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';
import { z } from 'zod';

const serviceSchema = z.object({
  name: z.string().min(1),
  category: z.string(),
  description: z.string(),
  duration: z.number().min(1),
  price: z.number().min(0),
  requirements: z.object({
    tools: z.array(z.string()),
    skills: z.array(z.string()),
    certifications: z.array(z.string()),
  }),
  procedures: z.object({
    steps: z.array(z.string()),
    safetyGuidelines: z.array(z.string()),
    qualityChecks: z.array(z.string()),
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
          case 'services':
            return await getServices(req, res);
          case 'providers':
            return await getProviders(req, res);
          case 'analytics':
            return await getAnalytics(req, res);
          default:
            return res.status(404).json({ error: 'Route not found' });
        }

      case 'POST':
        switch (routePath) {
          case 'services':
            return await createService(req, res);
          case 'providers':
            return await createProvider(req, res);
          case 'assignments':
            return await createAssignment(req, res);
          default:
            return res.status(404).json({ error: 'Route not found' });
        }

      case 'PUT':
        switch (routePath) {
          case 'services':
            return await updateService(req, res);
          case 'providers':
            return await updateProvider(req, res);
          default:
            return res.status(404).json({ error: 'Route not found' });
        }

      case 'DELETE':
        switch (routePath) {
          case 'services':
            return await deleteService(req, res);
          case 'providers':
            return await deleteProvider(req, res);
          default:
            return res.status(404).json({ error: 'Route not found' });
        }

      default:
        return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Service API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getServices(req: NextApiRequest, res: NextApiResponse) {
  const { category, status, search } = req.query;

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
      { description: { contains: search as string, mode: 'insensitive' } },
    ];
  }

  const services = await prisma.maintenanceService.findMany({
    where,
    include: {
      requirements: true,
      procedures: true,
      metrics: true,
    },
  });

  return res.status(200).json(services);
}

async function createService(req: NextApiRequest, res: NextApiResponse) {
  const validation = serviceSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ error: validation.error });
  }

  const service = await prisma.maintenanceService.create({
    data: {
      ...validation.data,
      status: 'active',
      createdBy: req.session!.user.id,
      metrics: {
        create: {
          completionRate: 0,
          customerSatisfaction: 0,
          averageTime: validation.data.duration,
          revenueGenerated: 0,
        },
      },
    },
    include: {
      requirements: true,
      procedures: true,
      metrics: true,
    },
  });

  return res.status(201).json(service);
}

async function updateService(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const validation = serviceSchema.partial().safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ error: validation.error });
  }

  const service = await prisma.maintenanceService.update({
    where: { id: id as string },
    data: validation.data,
    include: {
      requirements: true,
      procedures: true,
      metrics: true,
    },
  });

  return res.status(200).json(service);
}

async function deleteService(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  await prisma.maintenanceService.delete({
    where: { id: id as string },
  });

  return res.status(204).end();
}

async function getProviders(req: NextApiRequest, res: NextApiResponse) {
  const { specialty, availability } = req.query;

  const where: any = {};

  if (specialty) {
    where.specialties = {
      hasSome: [specialty as string],
    };
  }

  if (availability) {
    where.availability = {
      nextAvailable: {
        lte: new Date(availability as string),
      },
    };
  }

  const providers = await prisma.serviceProvider.findMany({
    where,
    include: {
      certifications: true,
      assignments: {
        where: {
          status: 'active',
        },
      },
    },
  });

  return res.status(200).json(providers);
}

async function createProvider(req: NextApiRequest, res: NextApiResponse) {
  const provider = await prisma.serviceProvider.create({
    data: {
      ...req.body,
      createdBy: req.session!.user.id,
    },
    include: {
      certifications: true,
      assignments: true,
    },
  });

  return res.status(201).json(provider);
}

async function updateProvider(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  const provider = await prisma.serviceProvider.update({
    where: { id: id as string },
    data: req.body,
    include: {
      certifications: true,
      assignments: true,
    },
  });

  return res.status(200).json(provider);
}

async function deleteProvider(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  await prisma.serviceProvider.delete({
    where: { id: id as string },
  });

  return res.status(204).end();
}

async function createAssignment(req: NextApiRequest, res: NextApiResponse) {
  const { serviceId, providerId, scheduledDate, notes } = req.body;

  const assignment = await prisma.serviceAssignment.create({
    data: {
      service: { connect: { id: serviceId } },
      provider: { connect: { id: providerId } },
      scheduledDate: new Date(scheduledDate),
      notes,
      status: 'scheduled',
      createdBy: req.session!.user.id,
    },
    include: {
      service: true,
      provider: true,
    },
  });

  // Update provider availability
  await prisma.serviceProvider.update({
    where: { id: providerId },
    data: {
      availability: {
        update: {
          nextAvailable: new Date(scheduledDate),
        },
      },
    },
  });

  return res.status(201).json(assignment);
}

async function getAnalytics(req: NextApiRequest, res: NextApiResponse) {
  const { startDate, endDate } = req.query;

  const dateRange = {
    gte: startDate ? new Date(startDate as string) : new Date(0),
    lte: endDate ? new Date(endDate as string) : new Date(),
  };

  const [services, assignments, providers] = await Promise.all([
    prisma.maintenanceService.findMany({
      include: {
        metrics: true,
      },
    }),
    prisma.serviceAssignment.findMany({
      where: {
        scheduledDate: dateRange,
      },
      include: {
        service: true,
        provider: true,
      },
    }),
    prisma.serviceProvider.findMany({
      include: {
        assignments: {
          where: {
            scheduledDate: dateRange,
          },
        },
      },
    }),
  ]);

  const analytics = {
    services: {
      total: services.length,
      byCategory: services.reduce((acc: any, service) => {
        const category = service.category;
        if (!acc[category]) {
          acc[category] = {
            count: 0,
            revenue: 0,
            satisfaction: 0,
          };
        }
        acc[category].count++;
        acc[category].revenue += service.metrics.revenueGenerated;
        acc[category].satisfaction +=
          service.metrics.customerSatisfaction;
        return acc;
      }, {}),
    },
    assignments: {
      total: assignments.length,
      completed: assignments.filter(
        (a) => a.status === 'completed'
      ).length,
      revenue: assignments.reduce(
        (acc, a) => acc + (a.service?.price || 0),
        0
      ),
    },
    providers: {
      total: providers.length,
      averageRating:
        providers.reduce((acc, p) => acc + p.rating, 0) /
        providers.length,
      totalAssignments: providers.reduce(
        (acc, p) => acc + p.assignments.length,
        0
      ),
    },
  };

  return res.status(200).json(analytics);
}
