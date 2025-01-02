import { ServiceRequest, Contractor, User, MaintenanceSchedule } from '@/types';

// API Configuration
const config = {
  apiUrl: 'http://localhost:3000/api',  // Default development URL
  environment: 'development'  // Default to development mode
};

async function fetchWithAuth(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${config.apiUrl}${endpoint}`, {
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

// Mock data for development
const mockData = {
  contractors: [
    { id: '1', name: 'John Doe', expertise: ['Plumbing', 'Electrical'], rating: 4.5 },
    { id: '2', name: 'Jane Smith', expertise: ['HVAC', 'General Repairs'], rating: 4.8 }
  ],
  user: {
    id: 'user1',
    name: 'Test User',
    email: 'test@example.com'
  },
  schedules: []
};

export const api = {
  // Service Requests
  async getServiceRequests(userId?: string): Promise<ServiceRequest[]> {
    const endpoint = userId ? `/service-requests?userId=${userId}` : '/service-requests';
    if (config.environment === 'development') {
      console.log('Mock get service requests:', endpoint);
      return [] as ServiceRequest[];
    }
    return fetchWithAuth(endpoint);
  },

  async createServiceRequest(data: Partial<ServiceRequest>): Promise<ServiceRequest> {
    if (config.environment === 'development') {
      console.log('Mock create service request:', data);
      return { id: 'mock-id', status: 'pending', ...data } as ServiceRequest;
    }
    return fetchWithAuth('/service-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateServiceRequest(id: string, data: Partial<ServiceRequest>): Promise<ServiceRequest> {
    if (config.environment === 'development') {
      console.log('Mock update service request:', { id, data });
      return { id, status: 'updated', ...data } as ServiceRequest;
    }
    return fetchWithAuth(`/service-requests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Contractors
  async getContractors(filters?: Record<string, any>): Promise<Contractor[]> {
    if (config.environment === 'development') {
      console.log('Mock get contractors, filters:', filters);
      return mockData.contractors as Contractor[];
    }
    const queryString = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return fetchWithAuth(`/contractors${queryString}`);
  },

  async getContractorById(id: string): Promise<Contractor> {
    if (config.environment === 'development') {
      const contractor = mockData.contractors.find(c => c.id === id);
      if (!contractor) throw new Error('Contractor not found');
      return contractor as Contractor;
    }
    return fetchWithAuth(`/contractors/${id}`);
  },

  // Users
  async getCurrentUser(): Promise<User> {
    if (config.environment === 'development') {
      return mockData.user as User;
    }
    return fetchWithAuth('/users/me');
  },

  async updateUserProfile(data: Partial<User>): Promise<User> {
    if (config.environment === 'development') {
      console.log('Mock update user profile:', data);
      return { ...mockData.user, ...data } as User;
    }
    return fetchWithAuth('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Maintenance Schedules
  async getMaintenanceSchedules(userId?: string): Promise<MaintenanceSchedule[]> {
    if (config.environment === 'development') {
      console.log('Mock get maintenance schedules for user:', userId);
      return mockData.schedules as MaintenanceSchedule[];
    }
    const endpoint = userId ? `/maintenance-schedules?userId=${userId}` : '/maintenance-schedules';
    return fetchWithAuth(endpoint);
  },

  async createMaintenanceSchedule(data: Partial<MaintenanceSchedule>): Promise<MaintenanceSchedule> {
    if (config.environment === 'development') {
      console.log('Mock create maintenance schedule:', data);
      return { id: 'schedule-1', ...data } as MaintenanceSchedule;
    }
    return fetchWithAuth('/maintenance-schedules', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateMaintenanceSchedule(id: string, data: Partial<MaintenanceSchedule>): Promise<MaintenanceSchedule> {
    if (config.environment === 'development') {
      console.log('Mock update maintenance schedule:', { id, data });
      return { id, ...data } as MaintenanceSchedule;
    }
    return fetchWithAuth(`/maintenance-schedules/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Reviews
  async createReview(contractorId: string, data: { rating: number; comment: string }): Promise<void> {
    if (config.environment === 'development') {
      console.log('Mock create review:', { contractorId, data });
      return;
    }
    return fetchWithAuth(`/contractors/${contractorId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Analytics
  async trackEvent(eventType: string, properties: Record<string, any>): Promise<void> {
    if (config.environment === 'development') {
      console.log('Mock track event:', { eventType, properties });
      return;
    }
    return fetchWithAuth('/analytics/events', {
      method: 'POST',
      body: JSON.stringify({ eventType, properties }),
    });
  }
};
