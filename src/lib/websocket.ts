import { createClient } from '@supabase/supabase-js';
import { getCurrentUser } from './auth';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface WebSocketMessage {
  type: 'service_request' | 'contractor_update' | 'payment' | 'system';
  title: string;
  message: string;
  data?: any;
  createdAt: string;
}

type MessageHandler = (message: WebSocketMessage) => void;

class WebSocketManager {
  private handlers: Set<MessageHandler> = new Set();
  private initialized = false;

  async initialize() {
    if (this.initialized) return;

    const user = await getCurrentUser();
    if (!user) return;

    // Subscribe to service request updates
    const serviceRequestsChannel = supabase
      .channel('service_requests')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'service_requests',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const message: WebSocketMessage = {
            type: 'service_request',
            title: 'Service Request Update',
            message: this.getServiceRequestMessage(payload),
            data: payload.new,
            createdAt: new Date().toISOString(),
          };
          this.notifyHandlers(message);
        }
      );

    // Subscribe to contractor updates
    const contractorUpdatesChannel = supabase
      .channel('contractor_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'contractor_updates',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const message: WebSocketMessage = {
            type: 'contractor_update',
            title: 'Contractor Update',
            message: this.getContractorMessage(payload),
            data: payload.new,
            createdAt: new Date().toISOString(),
          };
          this.notifyHandlers(message);
        }
      );

    // Subscribe to payment updates
    const paymentUpdatesChannel = supabase
      .channel('payment_updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'payments',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          const message: WebSocketMessage = {
            type: 'payment',
            title: 'Payment Update',
            message: this.getPaymentMessage(payload),
            data: payload.new,
            createdAt: new Date().toISOString(),
          };
          this.notifyHandlers(message);
        }
      );

    // Subscribe to system notifications
    const systemNotificationsChannel = supabase
      .channel('system_notifications')
      .on(
        'broadcast',
        { event: 'system_notification' },
        (payload) => {
          const message: WebSocketMessage = {
            type: 'system',
            title: 'System Notification',
            message: payload.payload.message,
            data: payload.payload,
            createdAt: new Date().toISOString(),
          };
          this.notifyHandlers(message);
        }
      );

    // Subscribe to all channels
    await Promise.all([
      serviceRequestsChannel.subscribe(),
      contractorUpdatesChannel.subscribe(),
      paymentUpdatesChannel.subscribe(),
      systemNotificationsChannel.subscribe(),
    ]);

    this.initialized = true;
  }

  private getServiceRequestMessage(payload: any): string {
    const { new: newData, old: oldData, eventType } = payload;
    
    switch (eventType) {
      case 'INSERT':
        return `New service request created: ${newData.title}`;
      case 'UPDATE':
        if (newData.status !== oldData.status) {
          return `Service request status updated to: ${newData.status}`;
        }
        return 'Service request details updated';
      case 'DELETE':
        return `Service request cancelled: ${oldData.title}`;
      default:
        return 'Service request updated';
    }
  }

  private getContractorMessage(payload: any): string {
    const { new: newData, eventType } = payload;
    
    switch (eventType) {
      case 'INSERT':
        return `New contractor update: ${newData.message}`;
      case 'UPDATE':
        return `Contractor information updated: ${newData.message}`;
      default:
        return 'Contractor update received';
    }
  }

  private getPaymentMessage(payload: any): string {
    const { new: newData, eventType } = payload;
    
    switch (eventType) {
      case 'INSERT':
        return `New payment processed: $${newData.amount}`;
      case 'UPDATE':
        return `Payment status updated: ${newData.status}`;
      default:
        return 'Payment update received';
    }
  }

  subscribe(handler: MessageHandler) {
    this.handlers.add(handler);
    return () => this.handlers.delete(handler);
  }

  private notifyHandlers(message: WebSocketMessage) {
    this.handlers.forEach((handler) => handler(message));
  }

  async disconnect() {
    await supabase.removeAllChannels();
    this.initialized = false;
    this.handlers.clear();
  }
}

export const webSocketManager = new WebSocketManager();
