import { supabase } from './auth';

export interface AnalyticsEvent {
  id: string;
  user_id?: string;
  event_type: string;
  properties: Record<string, any>;
  timestamp: string;
  session_id?: string;
}

export interface MaintenanceAnalytics {
  total_requests: number;
  requests_by_status: Record<string, number>;
  average_completion_time: number;
  common_issues: Array<{
    category: string;
    count: number;
  }>;
  contractor_performance: Array<{
    contractor_id: string;
    average_rating: number;
    completed_jobs: number;
    average_response_time: number;
  }>;
  seasonal_trends: Record<string, number>;
}

export interface UserAnalytics {
  total_spent: number;
  requests_submitted: number;
  average_request_value: number;
  preferred_contractors: string[];
  common_issues: string[];
  response_rate: number;
}

export async function trackEvent(eventData: Omit<AnalyticsEvent, 'id' | 'timestamp'>) {
  const { data, error } = await supabase
    .from('analytics_events')
    .insert([{
      ...eventData,
      timestamp: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMaintenanceAnalytics(
  startDate: string,
  endDate: string,
  filters?: {
    category?: string;
    contractor_id?: string;
    property_type?: string;
  }
): Promise<MaintenanceAnalytics> {
  const { data: requests, error: requestsError } = await supabase
    .from('service_requests')
    .select(`
      *,
      contractor:contractors(*)
    `)
    .gte('created_at', startDate)
    .lte('created_at', endDate);

  if (requestsError) throw requestsError;

  // Process the data to generate analytics
  const analytics: MaintenanceAnalytics = {
    total_requests: requests.length,
    requests_by_status: {},
    average_completion_time: 0,
    common_issues: [],
    contractor_performance: [],
    seasonal_trends: {}
  };

  // Calculate analytics from the requests data
  requests.forEach(request => {
    // Update requests by status
    analytics.requests_by_status[request.status] = 
      (analytics.requests_by_status[request.status] || 0) + 1;
    
    // Calculate completion time for completed requests
    if (request.status === 'completed' && request.completed_at) {
      const completionTime = new Date(request.completed_at).getTime() - 
        new Date(request.created_at).getTime();
      analytics.average_completion_time += completionTime;
    }

    // Track seasonal trends
    const month = new Date(request.created_at).getMonth();
    analytics.seasonal_trends[month] = 
      (analytics.seasonal_trends[month] || 0) + 1;
  });

  // Calculate averages
  if (requests.length > 0) {
    analytics.average_completion_time /= requests.length;
  }

  return analytics;
}

export async function getUserAnalytics(
  userId: string,
  period?: { start_date: string; end_date: string }
): Promise<UserAnalytics> {
  // Get user's service requests
  let query = supabase
    .from('service_requests')
    .select('*, contractor:contractors(*)')
    .eq('user_id', userId);

  if (period) {
    query = query
      .gte('created_at', period.start_date)
      .lte('created_at', period.end_date);
  }

  const { data: requests, error: requestsError } = await query;
  if (requestsError) throw requestsError;

  // Get user's payments
  const { data: payments, error: paymentsError } = await supabase
    .from('payments')
    .select('*')
    .eq('user_id', userId);

  if (paymentsError) throw paymentsError;

  // Calculate analytics
  const analytics: UserAnalytics = {
    total_spent: payments.reduce((sum, payment) => sum + payment.amount, 0),
    requests_submitted: requests.length,
    average_request_value: 0,
    preferred_contractors: [],
    common_issues: [],
    response_rate: 0
  };

  // Calculate average request value
  if (requests.length > 0) {
    analytics.average_request_value = analytics.total_spent / requests.length;
  }

  // Find preferred contractors
  const contractorCounts = requests.reduce((acc, request) => {
    if (request.contractor_id) {
      acc[request.contractor_id] = (acc[request.contractor_id] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  analytics.preferred_contractors = Object.entries(contractorCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([contractorId]) => contractorId);

  // Find common issues
  const issueCounts = requests.reduce((acc, request) => {
    if (request.service_type) {
      acc[request.service_type] = (acc[request.service_type] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  analytics.common_issues = Object.entries(issueCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([issue]) => issue);

  return analytics;
}

export async function getContractorAnalytics(
  contractorId: string,
  period?: { start_date: string; end_date: string }
) {
  let query = supabase
    .from('service_requests')
    .select(`
      *,
      reviews:contractor_reviews(*)
    `)
    .eq('contractor_id', contractorId);

  if (period) {
    query = query
      .gte('created_at', period.start_date)
      .lte('created_at', period.end_date);
  }

  const { data: requests, error } = await query;
  if (error) throw error;

  return {
    total_jobs: requests.length,
    completed_jobs: requests.filter(r => r.status === 'completed').length,
    average_completion_time: calculateAverageCompletionTime(requests),
    revenue: calculateTotalRevenue(requests),
    rating: calculateAverageRating(requests),
    popular_services: getPopularServices(requests)
  };
}

// Helper functions for contractor analytics
function calculateAverageCompletionTime(requests: any[]) {
  const completedRequests = requests.filter(r => 
    r.status === 'completed' && r.completed_at
  );
  
  if (completedRequests.length === 0) return 0;

  const totalTime = completedRequests.reduce((sum, request) => {
    const completionTime = new Date(request.completed_at).getTime() - 
      new Date(request.created_at).getTime();
    return sum + completionTime;
  }, 0);

  return totalTime / completedRequests.length;
}

function calculateTotalRevenue(requests: any[]) {
  return requests.reduce((sum, request) => {
    return sum + (request.actual_cost || 0);
  }, 0);
}

function calculateAverageRating(requests: any[]) {
  const reviews = requests.flatMap(r => r.reviews);
  if (reviews.length === 0) return 0;

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return totalRating / reviews.length;
}

function getPopularServices(requests: any[]) {
  const serviceCounts = requests.reduce((acc, request) => {
    if (request.service_type) {
      acc[request.service_type] = (acc[request.service_type] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return Object.entries(serviceCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([service, count]) => ({ service, count }));
}
