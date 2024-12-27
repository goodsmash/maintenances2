import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';

interface NotificationChannel {
  id: string;
  type: 'email' | 'sms' | 'push' | 'whatsapp';
  value: string;
  verified: boolean;
}

interface NotificationPreference {
  id: string;
  category: string;
  enabled: boolean;
  channels: {
    email: boolean;
    sms: boolean;
    push: boolean;
    whatsapp: boolean;
  };
  frequency: 'instant' | 'daily' | 'weekly';
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

const notificationSchema = z.object({
  channels: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    push: z.boolean(),
    whatsapp: z.boolean(),
  }),
  preferences: z.array(
    z.object({
      id: z.string(),
      enabled: z.boolean(),
      channels: z.object({
        email: z.boolean(),
        sms: z.boolean(),
        push: z.boolean(),
        whatsapp: z.boolean(),
      }),
      frequency: z.enum(['instant', 'daily', 'weekly']),
      quietHours: z.object({
        enabled: z.boolean(),
        start: z.string(),
        end: z.string(),
      }),
    })
  ),
});

type NotificationFormData = z.infer<typeof notificationSchema>;

const defaultCategories = [
  {
    id: 'service_updates',
    name: 'Service Updates',
    description: 'Updates about your scheduled services',
  },
  {
    id: 'contractor_updates',
    name: 'Contractor Updates',
    description: 'Messages from your assigned contractors',
  },
  {
    id: 'payment_updates',
    name: 'Payment Updates',
    description: 'Payment confirmations and receipts',
  },
  {
    id: 'promotions',
    name: 'Promotions & Offers',
    description: 'Special offers and discounts',
  },
  {
    id: 'system_updates',
    name: 'System Updates',
    description: 'Important system notifications',
  },
];

export function NotificationPreferences() {
  const [channels, setChannels] = useState<NotificationChannel[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm<NotificationFormData>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      channels: {
        email: false,
        sms: false,
        push: false,
        whatsapp: false,
      },
      preferences: defaultCategories.map((category) => ({
        id: category.id,
        enabled: true,
        channels: {
          email: true,
          sms: false,
          push: true,
          whatsapp: false,
        },
        frequency: 'instant' as const,
        quietHours: {
          enabled: false,
          start: '22:00',
          end: '07:00',
        },
      })),
    },
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      setLoading(true);
      const [channelsResponse, preferencesResponse] = await Promise.all([
        api.getNotificationChannels(),
        api.getNotificationPreferences(),
      ]);

      setChannels(channelsResponse);
      form.reset({
        channels: channelsResponse.reduce(
          (acc, channel) => ({
            ...acc,
            [channel.type]: true,
          }),
          {
            email: false,
            sms: false,
            push: false,
            whatsapp: false,
          }
        ),
        preferences: preferencesResponse,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load notification preferences',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: NotificationFormData) => {
    try {
      setLoading(true);
      await api.updateNotificationPreferences(data);
      toast({
        title: 'Success',
        description: 'Notification preferences updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update notification preferences',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChannelVerification = async (channel: NotificationChannel) => {
    try {
      await api.sendVerificationCode(channel.id);
      toast({
        title: 'Verification Code Sent',
        description: `Please check your ${channel.type} for the verification code`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send verification code',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Notification Channels</CardTitle>
          <CardDescription>
            Manage your notification delivery channels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {channels.map((channel) => (
              <div
                key={channel.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h4 className="font-medium capitalize">{channel.type}</h4>
                  <p className="text-sm text-gray-500">{channel.value}</p>
                </div>
                <div className="flex items-center space-x-4">
                  {!channel.verified && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleChannelVerification(channel)}
                    >
                      Verify
                    </Button>
                  )}
                  <Switch
                    checked={form.watch(`channels.${channel.type}`)}
                    onCheckedChange={(checked) =>
                      form.setValue(`channels.${channel.type}`, checked)
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {defaultCategories.map((category, index) => (
            <Card key={category.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{category.name}</CardTitle>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                  <FormField
                    control={form.control}
                    name={`preferences.${index}.enabled`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-2">Notification Channels</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {Object.keys(form.watch(`preferences.${index}.channels`)).map(
                        (channelType) => (
                          <FormField
                            key={channelType}
                            control={form.control}
                            name={`preferences.${index}.channels.${channelType}`}
                            render={({ field }) => (
                              <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                  <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    disabled={
                                      !form.watch(`channels.${channelType}`)
                                    }
                                  />
                                </FormControl>
                                <FormLabel className="capitalize">
                                  {channelType}
                                </FormLabel>
                              </FormItem>
                            )}
                          />
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Notification Frequency</h4>
                    <FormField
                      control={form.control}
                      name={`preferences.${index}.frequency`}
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="instant">Instant</SelectItem>
                              <SelectItem value="daily">Daily Digest</SelectItem>
                              <SelectItem value="weekly">Weekly Digest</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Quiet Hours</h4>
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name={`preferences.${index}.quietHours.enabled`}
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <FormLabel>Enable Quiet Hours</FormLabel>
                          </FormItem>
                        )}
                      />

                      {form.watch(`preferences.${index}.quietHours.enabled`) && (
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`preferences.${index}.quietHours.start`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Start Time</FormLabel>
                                <FormControl>
                                  <Input
                                    type="time"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name={`preferences.${index}.quietHours.end`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>End Time</FormLabel>
                                <FormControl>
                                  <Input
                                    type="time"
                                    {...field}
                                  />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Preferences'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
