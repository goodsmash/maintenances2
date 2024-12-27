import { supabase } from './auth';

export interface ServiceRequest {
  id: string;
  user_id: string;
  contractor_id?: string;
  service_type: string;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'emergency';
  description: string;
  location: {
    address: string;
    unit?: string;
    access_instructions?: string;
  };
  preferred_schedule?: {
    date: string;
    time_slots: string[];
  };
  attachments?: {
    url: string;
    type: string;
    description?: string;
  }[];
  estimated_cost?: number;
  actual_cost?: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceQuote {
  id: string;
  request_id: string;
  contractor_id: string;
  cost_estimate: number;
  parts_cost?: number;
  labor_cost?: number;
  timeline: string;
  valid_until: string;
  notes?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
}

export async function createServiceRequest(requestData: Omit<ServiceRequest, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('service_requests')
    .insert([requestData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateServiceRequest(requestId: string, updates: Partial<ServiceRequest>) {
  const { data, error } = await supabase
    .from('service_requests')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', requestId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getServiceRequestById(requestId: string) {
  const { data, error } = await supabase
    .from('service_requests')
    .select('*, contractor:contractors(*)')
    .eq('id', requestId)
    .single();

  if (error) throw error;
  return data;
}

export async function getUserServiceRequests(userId: string, status?: ServiceRequest['status']) {
  let query = supabase
    .from('service_requests')
    .select('*, contractor:contractors(*)')
    .eq('user_id', userId);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function submitQuote(quoteData: Omit<ServiceQuote, 'id'>) {
  const { data, error } = await supabase
    .from('service_quotes')
    .insert([quoteData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function acceptQuote(quoteId: string, requestId: string) {
  const { error: updateQuoteError } = await supabase
    .from('service_quotes')
    .update({ status: 'accepted' })
    .eq('id', quoteId);

  if (updateQuoteError) throw updateQuoteError;

  const { data: quote } = await supabase
    .from('service_quotes')
    .select('*')
    .eq('id', quoteId)
    .single();

  const { error: updateRequestError } = await supabase
    .from('service_requests')
    .update({
      contractor_id: quote.contractor_id,
      status: 'assigned',
      estimated_cost: quote.cost_estimate
    })
    .eq('id', requestId);

  if (updateRequestError) throw updateRequestError;

  return { success: true };
}

export async function getRequestQuotes(requestId: string) {
  const { data, error } = await supabase
    .from('service_quotes')
    .select('*, contractor:contractors(*)')
    .eq('request_id', requestId);

  if (error) throw error;
  return data;
}
