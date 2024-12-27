import { useState, useEffect } from 'react';
import { Bell, Settings, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Notification, NotificationPreferences } from '@/types';
import { api } from '@/lib/api';

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
}

function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const isNew = !notification.read;
  const formattedDate = new Date(notification.createdAt).toLocaleDateString();
  const formattedTime = new Date(notification.createdAt).toLocaleTimeString();

  return (
    <Card className={`mb-4 ${isNew ? 'bg-muted' : ''}`}>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base">{notification.title}</CardTitle>
            <CardDescription className="text-sm">
              {formattedDate} at {formattedTime}
            </CardDescription>
          </div>
          {isNew && (
            <Badge variant="default" className="ml-2">
              New
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-gray-600">{notification.message}</p>
        <div className="flex justify-end mt-2 gap-2">
          {notification.actionUrl && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.href = notification.actionUrl!}
            >
              View
            </Button>
          )}
          {isNew && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRead(notification.id)}
            >
              Mark as Read
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

interface NotificationPreferencesFormProps {
  preferences: NotificationPreferences;
  onUpdate: (preferences: Partial<NotificationPreferences>) => void;
}

function NotificationPreferencesForm({ preferences, onUpdate }: NotificationPreferencesFormProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="font-medium">Notification Channels</h4>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="text-sm font-medium">Email Notifications</label>
            <p className="text-sm text-muted-foreground">
              Receive notifications via email
            </p>
          </div>
          <Switch
            checked={preferences.emailNotifications}
            onCheckedChange={(checked) =>
              onUpdate({ emailNotifications: checked })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="text-sm font-medium">Push Notifications</label>
            <p className="text-sm text-muted-foreground">
              Receive notifications in your browser
            </p>
          </div>
          <Switch
            checked={preferences.pushNotifications}
            onCheckedChange={(checked) =>
              onUpdate({ pushNotifications: checked })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <label className="text-sm font-medium">SMS Notifications</label>
            <p className="text-sm text-muted-foreground">
              Receive notifications via text message
            </p>
          </div>
          <Switch
            checked={preferences.smsNotifications}
            onCheckedChange={(checked) =>
              onUpdate({ smsNotifications: checked })
            }
          />
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="font-medium">Notification Types</h4>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Maintenance Reminders</label>
          <Switch
            checked={preferences.notificationTypes.maintenanceReminders}
            onCheckedChange={(checked) =>
              onUpdate({
                notificationTypes: {
                  ...preferences.notificationTypes,
                  maintenanceReminders: checked,
                },
              })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Request Updates</label>
          <Switch
            checked={preferences.notificationTypes.requestUpdates}
            onCheckedChange={(checked) =>
              onUpdate({
                notificationTypes: {
                  ...preferences.notificationTypes,
                  requestUpdates: checked,
                },
              })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Quote Received</label>
          <Switch
            checked={preferences.notificationTypes.quoteReceived}
            onCheckedChange={(checked) =>
              onUpdate({
                notificationTypes: {
                  ...preferences.notificationTypes,
                  quoteReceived: checked,
                },
              })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Payment Reminders</label>
          <Switch
            checked={preferences.notificationTypes.paymentReminders}
            onCheckedChange={(checked) =>
              onUpdate({
                notificationTypes: {
                  ...preferences.notificationTypes,
                  paymentReminders: checked,
                },
              })
            }
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">System Updates</label>
          <Switch
            checked={preferences.notificationTypes.systemUpdates}
            onCheckedChange={(checked) =>
              onUpdate({
                notificationTypes: {
                  ...preferences.notificationTypes,
                  systemUpdates: checked,
                },
              })
            }
          />
        </div>
      </div>
    </div>
  );
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [preferences, setPreferences] = useState<NotificationPreferences | null>(null);
  const [activeTab, setActiveTab] = useState<'notifications' | 'preferences'>('notifications');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadNotifications() {
      try {
        const response = await fetch('/api/notifications');
        const data = await response.json();
        setNotifications(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load notifications'));
      }
    }

    async function loadPreferences() {
      try {
        const response = await fetch('/api/notifications/preferences');
        const data = await response.json();
        setPreferences(data);
      } catch (err) {
        console.error('Failed to load notification preferences:', err);
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
    loadPreferences();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
      setNotifications(notifications.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      ));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleUpdatePreferences = async (updates: Partial<NotificationPreferences>) => {
    try {
      const response = await fetch('/api/notifications/preferences', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      const updatedPreferences = await response.json();
      setPreferences(updatedPreferences);
    } catch (error) {
      console.error('Failed to update notification preferences:', error);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <div className="flex justify-between items-center">
            <SheetTitle>Notifications</SheetTitle>
            <div className="flex gap-2">
              <Button
                variant={activeTab === 'notifications' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('notifications')}
              >
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button
                variant={activeTab === 'preferences' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('preferences')}
              >
                <Settings className="h-4 w-4 mr-2" />
                Preferences
              </Button>
            </div>
          </div>
        </SheetHeader>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 mt-4">
            {error.message}
          </div>
        ) : activeTab === 'notifications' ? (
          <ScrollArea className="h-[calc(100vh-120px)] mt-4">
            <div className="pr-4">
              {notifications.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">
                  No notifications
                </div>
              ) : (
                notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRead={handleMarkAsRead}
                  />
                ))
              )}
            </div>
          </ScrollArea>
        ) : (
          <div className="mt-4">
            {preferences && (
              <NotificationPreferencesForm
                preferences={preferences}
                onUpdate={handleUpdatePreferences}
              />
            )}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
