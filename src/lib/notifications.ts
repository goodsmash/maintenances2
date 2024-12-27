import { supabase } from './auth';

export interface Notification {
  id: string;
  user_id: string;
  type: 'maintenance' | 'request' | 'quote' | 'payment' | 'system';
  title: string;
  message: string;
  read: boolean;
  action_url?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface NotificationPreferences {
  user_id: string;
  email_notifications: boolean;
  push_notifications: boolean;
  sms_notifications: boolean;
  notification_types: {
    maintenance_reminders: boolean;
    request_updates: boolean;
    quote_received: boolean;
    payment_reminders: boolean;
    system_updates: boolean;
  };
}

export async function createNotification(notificationData: Omit<Notification, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('notifications')
    .insert([notificationData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getUserNotifications(userId: string, options?: {
  unreadOnly?: boolean;
  type?: Notification['type'];
  limit?: number;
}) {
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (options?.unreadOnly) {
    query = query.eq('read', false);
  }
  if (options?.type) {
    query = query.eq('type', options.type);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function markNotificationAsRead(notificationId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', notificationId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function markAllNotificationsAsRead(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false)
    .select();

  if (error) throw error;
  return data;
}

export async function updateNotificationPreferences(
  userId: string,
  preferences: Omit<NotificationPreferences, 'user_id'>
) {
  const { data, error } = await supabase
    .from('notification_preferences')
    .upsert([{ user_id: userId, ...preferences }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getNotificationPreferences(userId: string) {
  const { data, error } = await supabase
    .from('notification_preferences')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

// Helper function to send notifications through multiple channels
export async function sendNotification(
  userId: string,
  notification: Omit<Notification, 'id' | 'created_at' | 'user_id'>,
  channels?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  }
) {
  // First create the notification in the database
  const { data: notificationData } = await createNotification({
    ...notification,
    user_id: userId
  });

  // Get user's notification preferences
  const preferences = await getNotificationPreferences(userId);

  // Send through selected channels based on user preferences
  if (channels?.email && preferences.email_notifications) {
    // Implement email sending logic
    // This would typically integrate with an email service provider
  }

  if (channels?.push && preferences.push_notifications) {
    // Implement push notification logic
    // This would typically integrate with a push notification service
  }

  if (channels?.sms && preferences.sms_notifications) {
    // Implement SMS sending logic
    // This would typically integrate with an SMS service provider
  }

  return notificationData;
}
