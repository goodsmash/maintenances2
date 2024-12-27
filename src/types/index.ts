export type UserRole = 'user' | 'admin' | 'contractor';
export type SubscriptionTier = 'free' | 'basic' | 'premium' | 'enterprise';
export type RequestStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
export type PriorityLevel = 'low' | 'medium' | 'high' | 'emergency';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  subscriptionTier: SubscriptionTier;
  companyName?: string;
  phoneNumber: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Contractor {
  id: string;
  userId: string;
  companyName: string;
  services: string[];
  licenseNumber: string;
  insuranceInfo: {
    provider: string;
    policyNumber: string;
    expirationDate: string;
  };
  serviceAreas: string[];
  rating: number;
  availability: {
    schedule: {
      day: string;
      hours: string[];
    }[];
    emergencyAvailable: boolean;
  };
  pricing: {
    hourlyRate: number;
    serviceRates: Record<string, number>;
    minimumCharge: number;
  };
}

export interface ServiceRequest {
  id: string;
  userId: string;
  contractorId?: string;
  serviceType: string;
  status: RequestStatus;
  priority: PriorityLevel;
  description: string;
  location: {
    address: string;
    unit?: string;
    accessInstructions?: string;
  };
  preferredSchedule: {
    date: string;
    timeSlots: string[];
  };
  estimatedCost?: number;
  actualCost?: number;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface MaintenanceSchedule {
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: string;
  nextDueDate: string;
  lastCompleted?: string;
  tasks: {
    task: string;
    category: string;
    priority: PriorityLevel;
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface ContractorReview {
  id: string;
  contractorId: string;
  userId: string;
  requestId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
  createdAt: string;
}

export interface NotificationPreferences {
  userId: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  smsNotifications: boolean;
  notificationTypes: {
    maintenanceReminders: boolean;
    requestUpdates: boolean;
    quoteReceived: boolean;
    paymentReminders: boolean;
    systemUpdates: boolean;
  };
  updatedAt: string;
}

export interface AnalyticsEvent {
  id: string;
  userId: string;
  eventType: string;
  properties: Record<string, any>;
  sessionId?: string;
  timestamp: string;
}

export interface ScheduledReport {
  id: string;
  userId: string;
  type: string;
  title: string;
  description?: string;
  filters: Record<string, any>;
  schedule: {
    frequency: string;
    day: number;
    time: string;
  };
  lastRun?: string;
  createdAt: string;
  updatedAt: string;
}
