export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: string;
  description: string;
  quantity: number;
  unit: string;
  minQuantity: number;
  maxQuantity: number;
  reorderPoint: number;
  cost: number;
  price: number;
  supplier: {
    id: string;
    name: string;
    leadTime: number;
  };
  location: {
    warehouse: string;
    zone: string;
    shelf: string;
    bin: string;
  };
  status: 'in_stock' | 'low_stock' | 'out_of_stock' | 'discontinued';
  lastRestocked: string;
  nextDelivery?: string;
  batchNumber?: string;
  expiryDate?: string;
  tags: string[];
  metadata: Record<string, any>;
}

export interface InventoryMovement {
  id: string;
  itemId: string;
  type: 'received' | 'shipped' | 'returned' | 'adjusted' | 'transferred';
  quantity: number;
  date: string;
  reference: string;
  notes?: string;
  performedBy: string;
  location: {
    from: string;
    to: string;
  };
}

export interface InventoryAlert {
  id: string;
  type: 'low_stock' | 'expiring' | 'overstock' | 'price_change';
  itemId: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  date: string;
  status: 'new' | 'acknowledged' | 'resolved';
  metadata: Record<string, any>;
}

export interface StockCount {
  id: string;
  startDate: string;
  endDate: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  type: 'full' | 'partial' | 'cycle';
  items: {
    itemId: string;
    expectedQuantity: number;
    actualQuantity: number;
    discrepancy: number;
    notes?: string;
  }[];
  assignedTo: string[];
  completedBy?: string;
  notes?: string;
}

export interface InventoryReport {
  id: string;
  type: 'stock_level' | 'movement' | 'valuation' | 'aging' | 'forecast';
  dateRange: {
    start: string;
    end: string;
  };
  filters: Record<string, any>;
  data: any;
  generatedBy: string;
  generatedAt: string;
  format: 'pdf' | 'csv' | 'excel';
}

export interface InventorySettings {
  notifications: {
    lowStockThreshold: number;
    expiryWarningDays: number;
    overstockThreshold: number;
    enableEmailAlerts: boolean;
    enablePushNotifications: boolean;
  };
  stockCount: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    autoSchedule: boolean;
    requireApproval: boolean;
  };
  barcoding: {
    format: 'CODE128' | 'QR' | 'EAN13';
    prefix: string;
    autoGenerate: boolean;
  };
  units: {
    defaultUnit: string;
    supportedUnits: string[];
    conversionRates: Record<string, number>;
  };
  locations: {
    warehouses: string[];
    zones: string[];
    requireLocation: boolean;
  };
}
