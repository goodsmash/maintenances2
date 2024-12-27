import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserProfileForm } from '@/components/auth/UserProfile';
import { SubscriptionPlans } from '@/components/subscription/SubscriptionPlans';
import { BillingHistory } from '@/components/subscription/BillingHistory';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  User,
  CreditCard,
  Receipt,
  Bell,
  Shield,
  LogOut,
} from 'lucide-react';
import { signOut } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to sign out. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8">
        <div className="grid gap-8 md:grid-cols-[250px_1fr]">
          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <nav className="space-y-2">
                  <Button
                    variant={activeTab === 'profile' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('profile')}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button
                    variant={activeTab === 'subscription' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('subscription')}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Subscription
                  </Button>
                  <Button
                    variant={activeTab === 'billing' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('billing')}
                  >
                    <Receipt className="mr-2 h-4 w-4" />
                    Billing
                  </Button>
                  <Button
                    variant={activeTab === 'notifications' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('notifications')}
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </Button>
                  <Button
                    variant={activeTab === 'security' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setActiveTab('security')}
                  >
                    <Shield className="mr-2 h-4 w-4" />
                    Security
                  </Button>
                </nav>
              </CardContent>
            </Card>

            <Button
              variant="destructive"
              className="w-full"
              onClick={handleSignOut}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {activeTab === 'profile' && <UserProfileForm />}

            {activeTab === 'subscription' && <SubscriptionPlans />}

            {activeTab === 'billing' && <BillingHistory />}

            {activeTab === 'notifications' && (
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>
                    Manage how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Add notification preferences component here */}
                  <div className="text-center py-8 text-gray-500">
                    Notification preferences coming soon
                  </div>
                </CardContent>
              </Card>
            )}

            {activeTab === 'security' && (
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Add security settings component here */}
                  <div className="text-center py-8 text-gray-500">
                    Security settings coming soon
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
