import axios from 'axios';
import {
  InventoryItem,
  InventoryMovement,
  InventoryAlert,
  StockCount,
  InventoryReport,
  InventorySettings,
} from '@/types/inventory';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const inventoryApi = {
  // Item Management
  getItems: async (params?: {
    category?: string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await axios.get(`${BASE_URL}/api/inventory/items`, {
      params,
    });
    return response.data;
  },

  getItemById: async (itemId: string) => {
    const response = await axios.get(
      `${BASE_URL}/api/inventory/items/${itemId}`
    );
    return response.data;
  },

  createItem: async (itemData: Partial<InventoryItem>) => {
    const response = await axios.post(
      `${BASE_URL}/api/inventory/items`,
      itemData
    );
    return response.data;
  },

  updateItem: async (
    itemId: string,
    itemData: Partial<InventoryItem>
  ) => {
    const response = await axios.put(
      `${BASE_URL}/api/inventory/items/${itemId}`,
      itemData
    );
    return response.data;
  },

  deleteItem: async (itemId: string) => {
    const response = await axios.delete(
      `${BASE_URL}/api/inventory/items/${itemId}`
    );
    return response.data;
  },

  // Inventory Movements
  recordMovement: async (movementData: Partial<InventoryMovement>) => {
    const response = await axios.post(
      `${BASE_URL}/api/inventory/movements`,
      movementData
    );
    return response.data;
  },

  getMovements: async (params?: {
    itemId?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
  }) => {
    const response = await axios.get(
      `${BASE_URL}/api/inventory/movements`,
      { params }
    );
    return response.data;
  },

  // Stock Counts
  createStockCount: async (countData: Partial<StockCount>) => {
    const response = await axios.post(
      `${BASE_URL}/api/inventory/stock-counts`,
      countData
    );
    return response.data;
  },

  updateStockCount: async (
    countId: string,
    countData: Partial<StockCount>
  ) => {
    const response = await axios.put(
      `${BASE_URL}/api/inventory/stock-counts/${countId}`,
      countData
    );
    return response.data;
  },

  getStockCounts: async (params?: {
    status?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await axios.get(
      `${BASE_URL}/api/inventory/stock-counts`,
      { params }
    );
    return response.data;
  },

  // Alerts
  getAlerts: async (params?: {
    type?: string;
    severity?: string;
    status?: string;
  }) => {
    const response = await axios.get(`${BASE_URL}/api/inventory/alerts`, {
      params,
    });
    return response.data;
  },

  updateAlert: async (
    alertId: string,
    alertData: Partial<InventoryAlert>
  ) => {
    const response = await axios.put(
      `${BASE_URL}/api/inventory/alerts/${alertId}`,
      alertData
    );
    return response.data;
  },

  // Reports
  generateReport: async (reportData: Partial<InventoryReport>) => {
    const response = await axios.post(
      `${BASE_URL}/api/inventory/reports`,
      reportData
    );
    return response.data;
  },

  getReports: async (params?: {
    type?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await axios.get(
      `${BASE_URL}/api/inventory/reports`,
      { params }
    );
    return response.data;
  },

  downloadReport: async (reportId: string, format: string) => {
    const response = await axios.get(
      `${BASE_URL}/api/inventory/reports/${reportId}/download`,
      {
        params: { format },
        responseType: 'blob',
      }
    );
    return response.data;
  },

  // Settings
  getSettings: async () => {
    const response = await axios.get(
      `${BASE_URL}/api/inventory/settings`
    );
    return response.data;
  },

  updateSettings: async (settings: Partial<InventorySettings>) => {
    const response = await axios.put(
      `${BASE_URL}/api/inventory/settings`,
      settings
    );
    return response.data;
  },

  // Barcode Operations
  generateBarcode: async (itemId: string) => {
    const response = await axios.post(
      `${BASE_URL}/api/inventory/items/${itemId}/barcode`
    );
    return response.data;
  },

  scanBarcode: async (barcode: string) => {
    const response = await axios.get(
      `${BASE_URL}/api/inventory/barcode/${barcode}`
    );
    return response.data;
  },

  // Batch Operations
  batchUpdate: async (updates: Array<{
    itemId: string;
    data: Partial<InventoryItem>;
  }>) => {
    const response = await axios.post(
      `${BASE_URL}/api/inventory/batch-update`,
      { updates }
    );
    return response.data;
  },

  batchDelete: async (itemIds: string[]) => {
    const response = await axios.post(
      `${BASE_URL}/api/inventory/batch-delete`,
      { itemIds }
    );
    return response.data;
  },

  // Analytics
  getAnalytics: async (params: {
    metrics: string[];
    startDate: string;
    endDate: string;
    groupBy?: string;
  }) => {
    const response = await axios.get(
      `${BASE_URL}/api/inventory/analytics`,
      { params }
    );
    return response.data;
  },

  // Location Management
  getLocations: async () => {
    const response = await axios.get(
      `${BASE_URL}/api/inventory/locations`
    );
    return response.data;
  },

  updateLocation: async (
    locationId: string,
    locationData: Record<string, any>
  ) => {
    const response = await axios.put(
      `${BASE_URL}/api/inventory/locations/${locationId}`,
      locationData
    );
    return response.data;
  },

  // Supplier Integration
  getSupplierInventory: async (supplierId: string) => {
    const response = await axios.get(
      `${BASE_URL}/api/inventory/suppliers/${supplierId}/inventory`
    );
    return response.data;
  },

  createPurchaseOrder: async (orderData: {
    supplierId: string;
    items: Array<{
      itemId: string;
      quantity: number;
    }>;
  }) => {
    const response = await axios.post(
      `${BASE_URL}/api/inventory/purchase-orders`,
      orderData
    );
    return response.data;
  },
};
