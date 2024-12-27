import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PaymentSystem } from '@/components/PaymentSystem';
import { getCurrentUser, updateProfile } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';

interface PlanFeature {
  name: string;
  included: boolean;
}

interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: 'month' | 'year';
  description: string;
  features: PlanFeature[];
  recommended?: boolean;
}

const plans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    interval: 'month',
    description: 'Basic features for small property owners',
    features: [
      { name: 'Up to 5 service requests per month', included: true },
      { name: 'Basic maintenance scheduling', included: true },
      { name: 'Email support', included: true },
      { name: 'Basic analytics', included: true },
      { name: 'Advanced reporting', included: false },
      { name: 'Priority support', included: false },
      { name: 'Custom branding', included: false },
      { name: 'API access', included: false },
    ],
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 29,
    interval: 'month',
    description: 'Perfect for growing property management needs',
    features: [
      { name: 'Unlimited service requests', included: true },
      { name: 'Advanced maintenance scheduling', included: true },
      { name: 'Priority email support', included: true },
      { name: 'Advanced analytics', included: true },
      { name: 'Basic reporting', included: true },
      { name: 'Priority support', included: false },
      { name: 'Custom branding', included: false },
      { name: 'API access', included: false },
    ],
    recommended: true,
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 99,
    interval: 'month',
    description: 'Advanced features for professional property managers',
    features: [
      { name: 'Unlimited service requests', included: true },
      { name: 'Advanced maintenance scheduling', included: true },
      { name: '24/7 priority support', included: true },
      { name: 'Advanced analytics & reporting', included: true },
      { name: 'Custom reporting', included: true },
      { name: 'Priority support', included: true },
      { name: 'Custom branding', included: true },
      { name: 'API access', included: true },
    ],
  },
];

export function SubscriptionPlans() {
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    if (plan.price === 0) {
      handleFreePlan(plan);
    } else {
      setShowPayment(true);
    }
  };

  const handleFreePlan = async (plan: SubscriptionPlan) => {
    try {
      setLoading(true);
      const user = await getCurrentUser();
      if (!user) throw new Error('User not found');

      await updateProfile(user.id, {
        subscription_tier: plan.id as any,
        subscription_status: 'active',
      });

      toast({
        title: 'Plan Updated',
        description: 'You are now on the Free plan.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update subscription. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentComplete = async () => {
    if (!selectedPlan) return;

    try {
      const user = await getCurrentUser();
      if (!user) throw new Error('User not found');

      await updateProfile(user.id, {
        subscription_tier: selectedPlan.id as any,
        subscription_status: 'active',
      });

      toast({
        title: 'Subscription Updated',
        description: `You are now subscribed to the ${selectedPlan.name} plan.`,
      });

      setShowPayment(false);
      setSelectedPlan(null);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update subscription status. Please contact support.',
        variant: 'destructive',
      });
    }
  };

  if (showPayment && selectedPlan) {
    return (
      <div className="max-w-2xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => setShowPayment(false)}
          className="mb-4"
        >
          ← Back to Plans
        </Button>
        <PaymentSystem
          amount={selectedPlan.price * 100}
          description={`${selectedPlan.name} Plan Subscription`}
          onPaymentComplete={handlePaymentComplete}
          userId="user_id"
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold">Choose Your Plan</h2>
        <p className="text-gray-500 mt-2">
          Select the perfect plan for your property management needs
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={`relative ${
              plan.recommended
                ? 'border-primary shadow-lg scale-105'
                : 'border-border'
            }`}
          >
            {plan.recommended && (
              <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
                <span className="bg-primary text-primary-foreground text-sm font-medium px-3 py-1 rounded-full">
                  Recommended
                </span>
              </div>
            )}
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold">${plan.price}</span>
                <span className="text-gray-500 ml-2">/{plan.interval}</span>
              </div>
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <Check
                      className={`h-5 w-5 ${
                        feature.included
                          ? 'text-primary'
                          : 'text-gray-300'
                      }`}
                    />
                    <span
                      className={
                        feature.included ? 'text-gray-900' : 'text-gray-500'
                      }
                    >
                      {feature.name}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                variant={plan.recommended ? 'default' : 'outline'}
                onClick={() => handleSelectPlan(plan)}
                disabled={loading && selectedPlan?.id === plan.id}
              >
                {loading && selectedPlan?.id === plan.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Get ${plan.name}`
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-gray-500">
        <p>
          All plans include a 14-day free trial. No credit card required for free
          plan.
        </p>
        <p className="mt-2">
          Need a custom plan?{' '}
          <a href="/contact" className="text-primary hover:underline">
            Contact us
          </a>
        </p>
      </div>
    </div>
  );
}
