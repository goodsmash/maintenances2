import { supabase } from './auth';

export interface Permit {
  id: string;
  user_id: string;
  contractor_id?: string;
  type: 'building' | 'electrical' | 'plumbing' | 'mechanical' | 'other';
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'rejected' | 'expired';
  project_details: {
    title: string;
    description: string;
    estimated_cost: number;
    property_type: 'residential' | 'commercial';
    scope_of_work: string[];
  };
  property_info: {
    address: string;
    parcel_number?: string;
    zoning?: string;
    year_built?: number;
  };
  documents: {
    url: string;
    type: string;
    name: string;
    uploaded_at: string;
  }[];
  timeline: {
    submitted_at?: string;
    review_started_at?: string;
    last_updated_at?: string;
    approved_at?: string;
    expires_at?: string;
  };
  comments?: {
    id: string;
    user_id: string;
    message: string;
    created_at: string;
  }[];
  fees?: {
    application_fee: number;
    inspection_fee?: number;
    other_fees?: Record<string, number>;
    total: number;
    paid: boolean;
  };
}

export interface PermitRequirement {
  type: Permit['type'];
  required_documents: string[];
  fees: {
    base_fee: number;
    additional_fees?: Record<string, number>;
  };
  timeline: string;
  restrictions?: string[];
  prerequisites?: string[];
}

export async function createPermitApplication(permitData: Omit<Permit, 'id' | 'status' | 'timeline'>) {
  const { data, error } = await supabase
    .from('permits')
    .insert([{
      ...permitData,
      status: 'draft',
      timeline: {
        submitted_at: new Date().toISOString()
      }
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePermitApplication(permitId: string, updates: Partial<Permit>) {
  const { data, error } = await supabase
    .from('permits')
    .update({
      ...updates,
      'timeline.last_updated_at': new Date().toISOString()
    })
    .eq('id', permitId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function submitPermitApplication(permitId: string) {
  const { data, error } = await supabase
    .from('permits')
    .update({
      status: 'submitted',
      'timeline.submitted_at': new Date().toISOString()
    })
    .eq('id', permitId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPermitById(permitId: string) {
  const { data, error } = await supabase
    .from('permits')
    .select('*, comments(*)')
    .eq('id', permitId)
    .single();

  if (error) throw error;
  return data;
}

export async function getUserPermits(userId: string, status?: Permit['status']) {
  let query = supabase
    .from('permits')
    .select('*')
    .eq('user_id', userId);

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function addPermitComment(permitId: string, userId: string, message: string) {
  const { data, error } = await supabase
    .from('permit_comments')
    .insert([{
      permit_id: permitId,
      user_id: userId,
      message,
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function uploadPermitDocument(permitId: string, file: File, type: string) {
  const fileName = `${permitId}/${type}/${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from('permit-documents')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from('permit-documents')
    .getPublicUrl(fileName);

  const { data, error } = await supabase
    .from('permits')
    .update({
      documents: supabase.sql`array_append(documents, ${JSON.stringify({
        url: publicUrl,
        type,
        name: file.name,
        uploaded_at: new Date().toISOString()
      })})`
    })
    .eq('id', permitId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPermitRequirements(type: Permit['type'], propertyType: 'residential' | 'commercial') {
  const { data, error } = await supabase
    .from('permit_requirements')
    .select('*')
    .eq('type', type)
    .eq('property_type', propertyType)
    .single();

  if (error) throw error;
  return data as PermitRequirement;
}
