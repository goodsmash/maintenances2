import { createClient } from '@supabase/supabase-js';

// Mock configuration for development
const config = {
  supabaseUrl: 'https://your-project.supabase.co',  // Replace with actual URL when ready
  supabaseAnonKey: 'your-anon-key'  // Replace with actual key when ready
};

export const supabase = config.supabaseUrl && config.supabaseAnonKey 
  ? createClient(config.supabaseUrl, config.supabaseAnonKey)
  : null;

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  role: 'user' | 'admin' | 'contractor';
  subscription_tier?: 'free' | 'basic' | 'premium' | 'enterprise';
  subscription_status?: 'active' | 'inactive' | 'pending';
  company_name?: string;
  phone_number?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  created_at: string;
}

// Mock auth functions for development
export const auth = {
  signUp: async (email: string, password: string, userData: Partial<UserProfile>) => {
    console.log('Mock signup:', { email, userData });
    return { user: { id: 'mock-user-id', ...userData }, session: null };
  },

  signIn: async (email: string, password: string) => {
    console.log('Mock signin:', { email });
    return { user: { id: 'mock-user-id', email }, session: null };
  },

  signOut: async () => {
    console.log('Mock signout');
    return { error: null };
  },

  getCurrentUser: async () => {
    return { user: null, session: null };
  },

  updateProfile: async (userId: string, updates: Partial<UserProfile>) => {
    console.log('Mock update profile:', { userId, updates });
    return { data: updates, error: null };
  },

  checkSubscription: async (userId: string) => {
    return { data: { status: 'active', tier: 'basic' }, error: null };
  },

  getAllUsers: async () => {
    return { data: [], error: null };
  },

  updateUserRole: async (userId: string, role: UserProfile['role']) => {
    console.log('Mock update role:', { userId, role });
    return { data: { role }, error: null };
  }
};

// Original auth functions
export async function signUp(email: string, password: string, userData: Partial<UserProfile>) {
  if (!supabase) return auth.signUp(email, password, userData);
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: userData.full_name,
        role: 'user',
        subscription_tier: 'free',
        subscription_status: 'active',
        ...userData
      }
    }
  });

  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  if (!supabase) return auth.signIn(email, password);
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  if (!supabase) return auth.signOut();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentUser() {
  if (!supabase) return auth.getCurrentUser();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return {
    ...user,
    ...profile
  };
}

export async function updateProfile(userId: string, updates: Partial<UserProfile>) {
  if (!supabase) return auth.updateProfile(userId, updates);
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) throw error;
  return data;
}

export async function checkSubscription(userId: string) {
  if (!supabase) return auth.checkSubscription(userId);
  const { data, error } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

// Admin functions
export async function getAllUsers() {
  if (!supabase) return auth.getAllUsers();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function updateUserRole(userId: string, role: UserProfile['role']) {
  if (!supabase) return auth.updateUserRole(userId, role);
  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('id', userId);

  if (error) throw error;
  return data;
}
