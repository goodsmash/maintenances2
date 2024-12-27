import { useState, useEffect } from 'react';
import { webSocketManager, WebSocketMessage } from '@/lib/websocket';
import { useToast } from '@/components/ui/use-toast';

export interface NotificationPreferences {
  serviceRequests: boolean;
  contractorUpdates: boolean;
  payments: boolean;
  system: boolean;
  sound: boolean;
  desktop: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  serviceRequests: true,
  contractorUpdates: true,
  payments: true,
  system: true,
  sound: true,
  desktop: true,
};

export function useNotifications() {
  const [notifications, setNotifications] = useState<WebSocketMessage[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const { toast } = useToast();

  // Initialize desktop notifications
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Request desktop notification permission
  const requestPermission = async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    }
    return 'denied' as NotificationPermission;
  };

  // Play notification sound
  const playNotificationSound = () => {
    if (preferences.sound) {
      const audio = new Audio('/sounds/notification.mp3');
      audio.play().catch((error) => console.error('Failed to play sound:', error));
    }
  };

  // Show desktop notification
  const showDesktopNotification = (message: WebSocketMessage) => {
    if (preferences.desktop && permission === 'granted') {
      const notification = new Notification(message.title, {
        body: message.message,
        icon: '/icons/notification-icon.png',
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    }
  };

  // Handle incoming notifications
  const handleNotification = (message: WebSocketMessage) => {
    // Check if notification type is enabled in preferences
    const isEnabled = (() => {
      switch (message.type) {
        case 'service_request':
          return preferences.serviceRequests;
        case 'contractor_update':
          return preferences.contractorUpdates;
        case 'payment':
          return preferences.payments;
        case 'system':
          return preferences.system;
        default:
          return true;
      }
    })();

    if (!isEnabled) return;

    // Add to notifications list
    setNotifications((prev) => [message, ...prev].slice(0, 100)); // Keep last 100 notifications

    // Show toast notification
    toast({
      title: message.title,
      description: message.message,
      duration: 5000,
    });

    // Play sound if enabled
    playNotificationSound();

    // Show desktop notification if enabled
    showDesktopNotification(message);
  };

  // Initialize WebSocket connection
  useEffect(() => {
    webSocketManager.initialize().catch((error) => {
      console.error('Failed to initialize WebSocket:', error);
    });

    const unsubscribe = webSocketManager.subscribe(handleNotification);

    return () => {
      unsubscribe();
      webSocketManager.disconnect().catch((error) => {
        console.error('Failed to disconnect WebSocket:', error);
      });
    };
  }, [preferences]);

  // Update notification preferences
  const updatePreferences = (newPreferences: Partial<NotificationPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...newPreferences }));
  };

  // Mark notification as read
  const markAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.data?.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    preferences,
    permission,
    requestPermission,
    updatePreferences,
    markAsRead,
    markAllAsRead,
    clearAll,
  };
}
