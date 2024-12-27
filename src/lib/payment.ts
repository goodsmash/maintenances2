import { loadStripe } from '@stripe/stripe-js';
import { supabase } from './auth';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

export interface Payment {
  id: string;
  user_id: string;
  request_id?: string;
  contractor_id?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  payment_method: 'card' | 'bank_transfer' | 'wallet';
  description?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface PaymentMethod {
  id: string;
  user_id: string;
  type: 'card' | 'bank_account';
  details: {
    last4: string;
    brand?: string;
    exp_month?: number;
    exp_year?: number;
    bank_name?: string;
  };
  is_default: boolean;
}

export async function createPayment(paymentData: Omit<Payment, 'id' | 'status' | 'created_at'>) {
  const { data, error } = await supabase.functions.invoke('create-payment', {
    body: paymentData
  });

  if (error) throw error;
  return data;
}

export async function getPaymentById(paymentId: string) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('id', paymentId)
    .single();

  if (error) throw error;
  return data;
}

export async function getUserPayments(userId: string) {
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function addPaymentMethod(userId: string, paymentMethodData: {
  type: PaymentMethod['type'];
  token: string;
  is_default?: boolean;
}) {
  const { data, error } = await supabase.functions.invoke('add-payment-method', {
    body: {
      userId,
      ...paymentMethodData
    }
  });

  if (error) throw error;
  return data;
}

export async function removePaymentMethod(userId: string, paymentMethodId: string) {
  const { data, error } = await supabase.functions.invoke('remove-payment-method', {
    body: {
      userId,
      paymentMethodId
    }
  });

  if (error) throw error;
  return data;
}

export async function getUserPaymentMethods(userId: string) {
  const { data, error } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

export async function setDefaultPaymentMethod(userId: string, paymentMethodId: string) {
  // First, set all payment methods to non-default
  const { error: updateError } = await supabase
    .from('payment_methods')
    .update({ is_default: false })
    .eq('user_id', userId);

  if (updateError) throw updateError;

  // Then set the selected payment method as default
  const { data, error } = await supabase
    .from('payment_methods')
    .update({ is_default: true })
    .eq('id', paymentMethodId)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function processRefund(paymentId: string, amount?: number) {
  const { data, error } = await supabase.functions.invoke('process-refund', {
    body: {
      paymentId,
      amount
    }
  });

  if (error) throw error;
  return data;
}

export async function getPaymentSummary(userId: string, period?: {
  start_date: string;
  end_date: string;
}) {
  let query = supabase
    .from('payments')
    .select('*')
    .eq('user_id', userId);

  if (period) {
    query = query
      .gte('created_at', period.start_date)
      .lte('created_at', period.end_date);
  }

  const { data, error } = await query;
  if (error) throw error;

  const summary = {
    total_spent: 0,
    total_transactions: 0,
    by_status: {} as Record<Payment['status'], number>,
    by_payment_method: {} as Record<Payment['payment_method'], number>
  };

  data.forEach(payment => {
    summary.total_spent += payment.amount;
    summary.total_transactions += 1;
    summary.by_status[payment.status] = (summary.by_status[payment.status] || 0) + 1;
    summary.by_payment_method[payment.payment_method] = (summary.by_payment_method[payment.payment_method] || 0) + 1;
  });

  return summary;
}
