import { ServiceRequest, Contractor, User, MaintenanceSchedule } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  // Service Requests
  async getServiceRequests(userId?: string): Promise<ServiceRequest[]> {
    const endpoint = userId ? `/service-requests?userId=${userId}` : '/service-requests';
    return fetchWithAuth(endpoint);
  },

  async createServiceRequest(data: Partial<ServiceRequest>): Promise<ServiceRequest> {
    return fetchWithAuth('/service-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateServiceRequest(id: string, data: Partial<ServiceRequest>): Promise<ServiceRequest> {
    return fetchWithAuth(`/service-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Contractors
  async getContractors(filters?: Record<string, any>): Promise<Contractor[]> {
    const queryString = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return fetchWithAuth(`/contractors${queryString}`);
  },

  async getContractorById(id: string): Promise<Contractor> {
    return fetchWithAuth(`/contractors/${id}`);
  },

  // Users
  async getCurrentUser(): Promise<User> {
    return fetchWithAuth('/users/me');
  },

  async updateUserProfile(data: Partial<User>): Promise<User> {
    return fetchWithAuth('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Maintenance Schedules
  async getMaintenanceSchedules(userId?: string): Promise<MaintenanceSchedule[]> {
    const endpoint = userId ? `/maintenance-schedules?userId=${userId}` : '/maintenance-schedules';
    return fetchWithAuth(endpoint);
  },

  async createMaintenanceSchedule(data: Partial<MaintenanceSchedule>): Promise<MaintenanceSchedule> {
    return fetchWithAuth('/maintenance-schedules', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateMaintenanceSchedule(id: string, data: Partial<MaintenanceSchedule>): Promise<MaintenanceSchedule> {
    return fetchWithAuth(`/maintenance-schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Reviews
  async createReview(contractorId: string, data: { rating: number; comment: string }): Promise<void> {
    return fetchWithAuth(`/contractors/${contractorId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Analytics
  async trackEvent(eventType: string, properties: Record<string, any>): Promise<void> {
    return fetchWithAuth('/analytics/events', {
      method: 'POST',
      body: JSON.stringify({ eventType, properties }),
    });
  },
};
