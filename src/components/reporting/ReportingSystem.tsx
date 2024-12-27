import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Download } from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { api } from '@/lib/api';

interface ReportingMetrics {
  revenue: {
    total: number;
    byService: { name: string; value: number }[];
    byPeriod: { date: string; value: number }[];
    growth: number;
  };
  services: {
    total: number;
    completed: number;
    inProgress: number;
    cancelled: number;
    byCategory: { name: string; value: number }[];
    satisfaction: number;
  };
  contractors: {
    total: number;
    active: number;
    performance: {
      name: string;
      completionRate: number;
      satisfaction: number;
      revenue: number;
    }[];
  };
  compliance: {
    insuranceExpiring: number;
    certificationExpiring: number;
    incidentReports: number;
    openDisputes: number;
  };
  customerMetrics: {
    newCustomers: number;
    repeatRate: number;
    churnRate: number;
    nps: number;
    satisfactionTrend: { date: string; value: number }[];
  };
}

interface ComplianceAlert {
  id: string;
  type: 'insurance' | 'certification' | 'incident' | 'dispute';
  severity: 'low' | 'medium' | 'high';
  description: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'resolved';
  assignedTo?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function ReportingSystem() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [metrics, setMetrics] = useState<ReportingMetrics | null>(null);
  const [complianceAlerts, setComplianceAlerts] = useState<ComplianceAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadMetrics();
    loadComplianceAlerts();
  }, [timeRange]);

  const loadMetrics = async () => {
    try {
      setLoading(true);
      const response = await api.getReportingMetrics(timeRange);
      setMetrics(response);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load reporting metrics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadComplianceAlerts = async () => {
    try {
      const response = await api.getComplianceAlerts();
      setComplianceAlerts(response);
    } catch (error) {
      console.error('Failed to load compliance alerts:', error);
    }
  };

  const exportReport = async (type: 'pdf' | 'csv') => {
    try {
      const response = await api.exportReport({
        type,
        timeRange,
        metrics,
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `maintenance-report-${format(new Date(), 'yyyy-MM-dd')}.${type}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export report',
        variant: 'destructive',
      });
    }
  };

  if (loading || !metrics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Reports & Analytics</h2>
        <div className="flex items-center space-x-4">
          <Select
            value={timeRange}
            onValueChange={(value: any) => setTimeRange(value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={() => exportReport('pdf')}
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button
            variant="outline"
            onClick={() => exportReport('csv')}
          >
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${metrics.revenue.total.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.revenue.growth > 0 ? '+' : ''}
              {metrics.revenue.growth}% from previous period
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Service Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {((metrics.services.completed / metrics.services.total) * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics.services.completed} of {metrics.services.total} services completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Customer Satisfaction
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.services.satisfaction.toFixed(1)}/5.0
            </div>
            <p className="text-xs text-muted-foreground">
              Based on {metrics.services.completed} reviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Contractors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.contractors.active}
            </div>
            <p className="text-xs text-muted-foreground">
              {((metrics.contractors.active / metrics.contractors.total) * 100).toFixed(1)}% of total contractors
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>
              Revenue over the selected period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.revenue.byPeriod}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    name="Revenue"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Service Category</CardTitle>
            <CardDescription>
              Distribution of revenue across service categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.revenue.byService}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {metrics.revenue.byService.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service & Customer Metrics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Service Distribution</CardTitle>
            <CardDescription>
              Services by category and status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.services.byCategory}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" name="Services" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Satisfaction Trend</CardTitle>
            <CardDescription>
              Average satisfaction rating over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={metrics.customerMetrics.satisfactionTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#82ca9d"
                    name="Satisfaction"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Alerts</CardTitle>
          <CardDescription>
            Active compliance and regulatory alerts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {complianceAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h4 className="font-medium">{alert.description}</h4>
                  <p className="text-sm text-gray-500">
                    Due: {format(new Date(alert.dueDate), 'PPP')}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div
                    className={`px-3 py-1 rounded-full text-sm ${
                      alert.severity === 'high'
                        ? 'bg-red-100 text-red-800'
                        : alert.severity === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {alert.severity}
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm ${
                      alert.status === 'resolved'
                        ? 'bg-green-100 text-green-800'
                        : alert.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {alert.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
