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
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Download,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Clock,
  Star,
  Activity,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from 'lucide-react';
import { format, subDays, startOfMonth, endOfMonth } from 'date-fns';
import { api } from '@/lib/api';

interface AnalyticsData {
  overview: {
    totalRevenue: number;
    totalCustomers: number;
    totalServices: number;
    averageRating: number;
    customerGrowth: number;
    revenueGrowth: number;
    serviceGrowth: number;
    activeContractors: number;
  };
  revenue: {
    daily: {
      date: string;
      revenue: number;
      expenses: number;
      profit: number;
    }[];
    byService: {
      service: string;
      revenue: number;
      percentage: number;
    }[];
    byLocation: {
      location: string;
      revenue: number;
      percentage: number;
    }[];
  };
  services: {
    byCategory: {
      category: string;
      count: number;
      revenue: number;
    }[];
    byStatus: {
      status: string;
      count: number;
    }[];
    satisfaction: {
      rating: number;
      count: number;
    }[];
    trends: {
      date: string;
      scheduled: number;
      completed: number;
      cancelled: number;
    }[];
  };
  customers: {
    acquisition: {
      date: string;
      new: number;
      returning: number;
    }[];
    retention: {
      month: string;
      rate: number;
    }[];
    lifetime: {
      range: string;
      customers: number;
      value: number;
    }[];
    segments: {
      segment: string;
      count: number;
      value: number;
    }[];
  };
  contractors: {
    performance: {
      metric: string;
      value: number;
      change: number;
    }[];
    utilization: {
      contractor: string;
      rate: number;
      jobs: number;
    }[];
    ratings: {
      rating: number;
      count: number;
    }[];
  };
  operations: {
    response: {
      time: string;
      average: number;
    }[];
    completion: {
      time: string;
      average: number;
    }[];
    issues: {
      category: string;
      count: number;
      resolved: number;
    }[];
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const data = await api.getAnalytics(timeRange);
      setAnalytics(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load analytics data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const exportReport = async () => {
    try {
      const response = await api.exportAnalytics(timeRange);
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `analytics-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export analytics report',
        variant: 'destructive',
      });
    }
  };

  if (loading || !analytics) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
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
          <Button onClick={exportReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${analytics.overview.totalRevenue.toLocaleString()}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>{analytics.overview.revenueGrowth}% growth</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Customers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.overview.totalCustomers.toLocaleString()}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>{analytics.overview.customerGrowth}% growth</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Services
            </CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.overview.totalServices.toLocaleString()}
            </div>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span>{analytics.overview.serviceGrowth}% growth</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Customer Satisfaction
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.overview.averageRating.toFixed(1)}/5.0
            </div>
            <Progress
              value={analytics.overview.averageRating * 20}
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      {/* Revenue Analysis */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
            <CardDescription>
              Daily revenue, expenses, and profit
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.revenue.daily}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                    name="Revenue"
                  />
                  <Area
                    type="monotone"
                    dataKey="expenses"
                    stackId="1"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    name="Expenses"
                  />
                  <Area
                    type="monotone"
                    dataKey="profit"
                    stackId="1"
                    stroke="#ffc658"
                    fill="#ffc658"
                    name="Profit"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue by Service</CardTitle>
            <CardDescription>
              Distribution of revenue across services
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analytics.revenue.byService}
                    dataKey="revenue"
                    nameKey="service"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {analytics.revenue.byService.map((entry, index) => (
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

      {/* Service Analytics */}
      <Card>
        <CardHeader>
          <CardTitle>Service Analytics</CardTitle>
          <CardDescription>
            Service performance and trends
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="trends">
            <TabsList>
              <TabsTrigger value="trends">Service Trends</TabsTrigger>
              <TabsTrigger value="categories">Categories</TabsTrigger>
              <TabsTrigger value="satisfaction">
                Customer Satisfaction
              </TabsTrigger>
            </TabsList>
            <TabsContent value="trends">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analytics.services.trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="scheduled"
                      stroke="#8884d8"
                      name="Scheduled"
                    />
                    <Line
                      type="monotone"
                      dataKey="completed"
                      stroke="#82ca9d"
                      name="Completed"
                    />
                    <Line
                      type="monotone"
                      dataKey="cancelled"
                      stroke="#ff7300"
                      name="Cancelled"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="categories">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.services.byCategory}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" />
                    <YAxis yAxisId="left" />
                    <YAxis
                      yAxisId="right"
                      orientation="right"
                      tickFormatter={(value) =>
                        `$${value.toLocaleString()}`
                      }
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="count"
                      fill="#8884d8"
                      name="Number of Services"
                    />
                    <Bar
                      yAxisId="right"
                      dataKey="revenue"
                      fill="#82ca9d"
                      name="Revenue"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            <TabsContent value="satisfaction">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.services.satisfaction}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="rating" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="count"
                      fill="#8884d8"
                      name="Number of Ratings"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Customer Analytics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Acquisition</CardTitle>
            <CardDescription>
              New vs returning customers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.customers.acquisition}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="new"
                    stackId="1"
                    stroke="#8884d8"
                    fill="#8884d8"
                    name="New Customers"
                  />
                  <Area
                    type="monotone"
                    dataKey="returning"
                    stackId="1"
                    stroke="#82ca9d"
                    fill="#82ca9d"
                    name="Returning Customers"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customer Retention</CardTitle>
            <CardDescription>Monthly retention rates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.customers.retention}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    tickFormatter={(value) => `${value}%`}
                    domain={[0, 100]}
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#8884d8"
                    name="Retention Rate"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Contractor Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Contractor Performance</CardTitle>
          <CardDescription>
            Key performance indicators for contractors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="grid gap-4 md:grid-cols-3">
              {analytics.contractors.performance.map((metric) => (
                <Card key={metric.metric}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">
                      {metric.metric}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {metric.value.toFixed(1)}
                    </div>
                    <div
                      className={`text-xs ${
                        metric.change > 0
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {metric.change > 0 ? '+' : ''}
                      {metric.change}% from last period
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-4">
                  Contractor Utilization
                </h4>
                <div className="space-y-4">
                  {analytics.contractors.utilization.map(
                    (contractor) => (
                      <div
                        key={contractor.contractor}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium">
                            {contractor.contractor}
                          </div>
                          <div className="text-sm text-gray-500">
                            {contractor.jobs} jobs completed
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            {contractor.rate}% utilization
                          </div>
                          <Progress
                            value={contractor.rate}
                            className="w-[100px]"
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">
                  Contractor Ratings Distribution
                </h4>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analytics.contractors.ratings}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="rating" />
                      <YAxis />
                      <Tooltip />
                      <Bar
                        dataKey="count"
                        fill="#8884d8"
                        name="Number of Ratings"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operational Metrics */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Response Times</CardTitle>
            <CardDescription>
              Average response times by time of day
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.operations.response}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="average"
                    stroke="#8884d8"
                    name="Average Response Time (min)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Issue Resolution</CardTitle>
            <CardDescription>
              Issues by category and resolution status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.operations.issues}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="count"
                    fill="#8884d8"
                    name="Total Issues"
                  />
                  <Bar
                    dataKey="resolved"
                    fill="#82ca9d"
                    name="Resolved Issues"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
