import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './auth';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export interface SubscriptionPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  interval: 'month' | 'year';
  features: string[];
  limits: {
    requests_per_month: number;
    contractors_access: number;
    priority_support: boolean;
    custom_branding: boolean;
  };
}

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'free',
    name: 'Free',
    description: 'Basic maintenance tracking for homeowners',
    price: 0,
    interval: 'month',
    features: [
      'Basic maintenance tracking',
      'Up to 5 maintenance requests/month',
      'Email support'
    ],
    limits: {
      requests_per_month: 5,
      contractors_access: 1,
      priority_support: false,
      custom_branding: false
    }
  },
  {
    id: 'basic',
    name: 'Basic',
    description: 'Perfect for small property managers',
    price: 29,
    interval: 'month',
    features: [
      'Up to 50 maintenance requests/month',
      'Priority email support',
      'Basic analytics',
      'Up to 3 contractor access'
    ],
    limits: {
      requests_per_month: 50,
      contractors_access: 3,
      priority_support: false,
      custom_branding: false
    }
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Ideal for property management companies',
    price: 99,
    interval: 'month',
    features: [
      'Unlimited maintenance requests',
      'Priority support',
      'Advanced analytics',
      'Custom branding',
      'Unlimited contractor access'
    ],
    limits: {
      requests_per_month: -1, // unlimited
      contractors_access: -1, // unlimited
      priority_support: true,
      custom_branding: true
    }
  }
];

export async function createSubscription(priceId: string, customerId: string) {
  const { data, error } = await supabase.functions.invoke('create-subscription', {
    body: { priceId, customerId }
  });

  if (error) throw error;
  return data;
}

export async function cancelSubscription(subscriptionId: string) {
  const { data, error } = await supabase.functions.invoke('cancel-subscription', {
    body: { subscriptionId }
  });

  if (error) throw error;
  return data;
}

export async function updateSubscription(subscriptionId: string, newPriceId: string) {
  const { data, error } = await supabase.functions.invoke('update-subscription', {
    body: { subscriptionId, newPriceId }
  });

  if (error) throw error;
  return data;
}

export async function getSubscriptionStatus(userId: string) {
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function createCheckoutSession(priceId: string) {
  const stripe = await stripePromise;
  if (!stripe) throw new Error('Stripe not initialized');

  const { data, error } = await supabase.functions.invoke('create-checkout-session', {
    body: { priceId }
  });

  if (error) throw error;

  const result = await stripe.redirectToCheckout({
    sessionId: data.sessionId
  });

  if (result.error) throw result.error;
  return result;
}

export function getPlanFeatures(planId: string): string[] {
  const plan = subscriptionPlans.find(p => p.id === planId);
  return plan ? plan.features : [];
}

export function checkFeatureAccess(userPlan: string, feature: keyof SubscriptionPlan['limits']): boolean {
  const plan = subscriptionPlans.find(p => p.id === userPlan);
  if (!plan) return false;
  return plan.limits[feature] !== false;
}
