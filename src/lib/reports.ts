import { supabase } from './auth';
import { getMaintenanceAnalytics, getUserAnalytics, getContractorAnalytics } from './analytics';
import { MaintenanceTask } from './serviceRequest';

export interface Report {
  id: string;
  user_id: string;
  type: 'maintenance' | 'contractor' | 'financial' | 'property' | 'custom';
  title: string;
  description?: string;
  date_range: {
    start_date: string;
    end_date: string;
  };
  filters?: Record<string, any>;
  data: any;
  created_at: string;
  format: 'pdf' | 'csv' | 'excel';
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    recipients: string[];
    last_sent?: string;
  };
}

export interface MaintenanceReport {
  summary: {
    total_requests: number;
    completed_requests: number;
    pending_requests: number;
    average_completion_time: string;
    total_cost: number;
  };
  by_category: Record<string, number>;
  by_priority: Record<string, number>;
  by_status: Record<string, number>;
  top_issues: Array<{
    issue: string;
    count: number;
    average_cost: number;
  }>;
  contractor_performance: Array<{
    contractor_id: string;
    name: string;
    jobs_completed: number;
    average_rating: number;
    total_revenue: number;
  }>;
}

export interface FinancialReport {
  summary: {
    total_expenses: number;
    planned_maintenance_cost: number;
    emergency_repairs_cost: number;
    contractor_payments: number;
    permits_and_fees: number;
  };
  monthly_breakdown: Array<{
    month: string;
    expenses: number;
    breakdown: Record<string, number>;
  }>;
  by_category: Record<string, number>;
  cost_projections: Array<{
    month: string;
    projected_cost: number;
    confidence_interval: [number, number];
  }>;
}

export async function generateMaintenanceReport(
  userId: string,
  dateRange: Report['date_range'],
  filters?: Record<string, any>
): Promise<MaintenanceReport> {
  // Get analytics data
  const analytics = await getMaintenanceAnalytics(
    dateRange.start_date,
    dateRange.end_date,
    filters
  );

  // Get service requests for the period
  const { data: requests, error } = await supabase
    .from('service_requests')
    .select(`
      *,
      contractor:contractors(*)
    `)
    .gte('created_at', dateRange.start_date)
    .lte('created_at', dateRange.end_date);

  if (error) throw error;

  // Process the data into report format
  const report: MaintenanceReport = {
    summary: {
      total_requests: requests.length,
      completed_requests: requests.filter(r => r.status === 'completed').length,
      pending_requests: requests.filter(r => r.status === 'pending').length,
      average_completion_time: formatDuration(analytics.average_completion_time),
      total_cost: requests.reduce((sum, r) => sum + (r.actual_cost || 0), 0)
    },
    by_category: {},
    by_priority: {},
    by_status: {},
    top_issues: [],
    contractor_performance: []
  };

  // Calculate breakdowns
  requests.forEach(request => {
    // By category
    report.by_category[request.category] = 
      (report.by_category[request.category] || 0) + 1;
    
    // By priority
    report.by_priority[request.priority] = 
      (report.by_priority[request.priority] || 0) + 1;
    
    // By status
    report.by_status[request.status] = 
      (report.by_status[request.status] || 0) + 1;
  });

  return report;
}

export async function generateFinancialReport(
  userId: string,
  dateRange: Report['date_range']
): Promise<FinancialReport> {
  // Get all financial transactions for the period
  const { data: transactions, error } = await supabase
    .from('payments')
    .select('*')
    .gte('created_at', dateRange.start_date)
    .lte('created_at', dateRange.end_date);

  if (error) throw error;

  // Process the data into report format
  const report: FinancialReport = {
    summary: {
      total_expenses: 0,
      planned_maintenance_cost: 0,
      emergency_repairs_cost: 0,
      contractor_payments: 0,
      permits_and_fees: 0
    },
    monthly_breakdown: [],
    by_category: {},
    cost_projections: []
  };

  // Calculate summary
  transactions.forEach(transaction => {
    report.summary.total_expenses += transaction.amount;
    
    // Categorize expenses
    if (transaction.type === 'planned_maintenance') {
      report.summary.planned_maintenance_cost += transaction.amount;
    } else if (transaction.type === 'emergency_repair') {
      report.summary.emergency_repairs_cost += transaction.amount;
    } else if (transaction.type === 'contractor_payment') {
      report.summary.contractor_payments += transaction.amount;
    } else if (transaction.type === 'permit_fee') {
      report.summary.permits_and_fees += transaction.amount;
    }

    // Update category breakdown
    report.by_category[transaction.category] = 
      (report.by_category[transaction.category] || 0) + transaction.amount;
  });

  // Generate monthly breakdown
  const monthlyData = groupTransactionsByMonth(transactions);
  report.monthly_breakdown = Object.entries(monthlyData).map(([month, data]) => ({
    month,
    expenses: data.total,
    breakdown: data.breakdown
  }));

  // Generate cost projections
  report.cost_projections = generateCostProjections(report.monthly_breakdown);

  return report;
}

export async function scheduleReport(reportConfig: Omit<Report, 'id' | 'created_at' | 'data'>) {
  const { data, error } = await supabase
    .from('scheduled_reports')
    .insert([{
      ...reportConfig,
      created_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getScheduledReports(userId: string) {
  const { data, error } = await supabase
    .from('scheduled_reports')
    .select('*')
    .eq('user_id', userId);

  if (error) throw error;
  return data;
}

// Helper functions
function formatDuration(ms: number): string {
  const hours = Math.floor(ms / (1000 * 60 * 60));
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${minutes}m`;
}

function groupTransactionsByMonth(transactions: any[]) {
  return transactions.reduce((acc, transaction) => {
    const month = new Date(transaction.created_at).toISOString().slice(0, 7);
    if (!acc[month]) {
      acc[month] = { total: 0, breakdown: {} };
    }
    acc[month].total += transaction.amount;
    acc[month].breakdown[transaction.category] = 
      (acc[month].breakdown[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {});
}

function generateCostProjections(monthlyData: any[]): any[] {
  // Simple linear regression for projection
  const projections = [];
  const lastThreeMonths = monthlyData.slice(-3);
  const average = lastThreeMonths.reduce((sum, month) => sum + month.expenses, 0) / 3;
  
  // Project next 3 months
  for (let i = 1; i <= 3; i++) {
    const projectedMonth = new Date();
    projectedMonth.setMonth(projectedMonth.getMonth() + i);
    
    projections.push({
      month: projectedMonth.toISOString().slice(0, 7),
      projected_cost: average,
      confidence_interval: [average * 0.8, average * 1.2]
    });
  }
  
  return projections;
}
