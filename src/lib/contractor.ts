import { supabase } from './auth';

export interface Contractor {
  id: string;
  user_id: string;
  company_name: string;
  services: string[];
  license_number?: string;
  insurance_info?: {
    provider: string;
    policy_number: string;
    expiration_date: string;
  };
  service_areas: string[];
  rating?: number;
  reviews?: ContractorReview[];
  availability?: {
    schedule: {
      day: string;
      hours: string[];
    }[];
    emergency_available: boolean;
  };
  pricing?: {
    hourly_rate?: number;
    service_rates?: Record<string, number>;
    minimum_charge?: number;
  };
}

export interface ContractorReview {
  id: string;
  contractor_id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  service_type: string;
}

export async function registerContractor(contractorData: Partial<Contractor>) {
  const { data, error } = await supabase
    .from('contractors')
    .insert([contractorData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateContractorProfile(contractorId: string, updates: Partial<Contractor>) {
  const { data, error } = await supabase
    .from('contractors')
    .update(updates)
    .eq('id', contractorId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getContractorById(contractorId: string) {
  const { data, error } = await supabase
    .from('contractors')
    .select('*, reviews(*)')
    .eq('id', contractorId)
    .single();

  if (error) throw error;
  return data;
}

export async function searchContractors(params: {
  service?: string;
  area?: string;
  rating?: number;
  availability?: string;
}) {
  let query = supabase
    .from('contractors')
    .select('*, reviews(*)');

  if (params.service) {
    query = query.contains('services', [params.service]);
  }
  if (params.area) {
    query = query.contains('service_areas', [params.area]);
  }
  if (params.rating) {
    query = query.gte('rating', params.rating);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function addContractorReview(review: Omit<ContractorReview, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('contractor_reviews')
    .insert([review])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateContractorAvailability(
  contractorId: string,
  availability: Contractor['availability']
) {
  const { data, error } = await supabase
    .from('contractors')
    .update({ availability })
    .eq('id', contractorId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getContractorSchedule(contractorId: string, startDate: string, endDate: string) {
  const { data, error } = await supabase
    .from('contractor_schedules')
    .select('*')
    .eq('contractor_id', contractorId)
    .gte('date', startDate)
    .lte('date', endDate);

  if (error) throw error;
  return data;
}
