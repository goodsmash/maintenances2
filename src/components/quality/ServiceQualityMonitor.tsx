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
import { useToast } from '@/components/ui/use-toast';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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
import { format } from 'date-fns';
import { api } from '@/lib/api';

interface QualityMetrics {
  overallScore: number;
  totalServices: number;
  completionRate: number;
  customerSatisfaction: {
    average: number;
    trend: { date: string; value: number }[];
    distribution: { rating: number; count: number }[];
  };
  responseTime: {
    average: string;
    trend: { date: string; value: number }[];
  };
  issueResolution: {
    firstTimeResolution: number;
    averageResolutionTime: string;
    byCategory: { category: string; resolutionRate: number }[];
  };
  qualityChecks: {
    passed: number;
    failed: number;
    pending: number;
    byCategory: { category: string; passRate: number }[];
  };
  complaints: {
    total: number;
    resolved: number;
    byType: { type: string; count: number }[];
    trend: { date: string; value: number }[];
  };
}

interface ServiceIssue {
  id: string;
  serviceId: string;
  type: string;
  description: string;
  severity: 'low' | 'medium' | 'high';
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  resolution?: string;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function ServiceQualityMonitor() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [metrics, setMetrics] = useState<QualityMetrics | null>(null);
  const [issues, setIssues] = useState<ServiceIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadQualityMetrics();
    loadServiceIssues();
  }, [timeRange]);

  const loadQualityMetrics = async () => {
    try {
      setLoading(true);
      const response = await api.getQualityMetrics(timeRange);
      setMetrics(response);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load quality metrics',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadServiceIssues = async () => {
    try {
      const response = await api.getServiceIssues();
      setIssues(response);
    } catch (error) {
      console.error('Failed to load service issues:', error);
    }
  };

  const handleIssueStatusUpdate = async (issueId: string, status: string) => {
    try {
      await api.updateIssueStatus(issueId, status);
      loadServiceIssues();
      toast({
        title: 'Success',
        description: 'Issue status updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update issue status',
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
        <h2 className="text-2xl font-bold">Service Quality Monitor</h2>
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
      </div>

      {/* Key Metrics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Quality Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.overallScore.toFixed(1)}/10
            </div>
            <p className="text-xs text-muted-foreground">
              Based on {metrics.totalServices} services
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
              {metrics.customerSatisfaction.average.toFixed(1)}/5
            </div>
            <p className="text-xs text-muted-foreground">
              From customer reviews
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
              {(metrics.completionRate * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Of scheduled services
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              First-Time Resolution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(metrics.issueResolution.firstTimeResolution * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Issues resolved first time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Customer Satisfaction Trends */}
      <div className="grid gap-6 md:grid-cols-2">
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
                <LineChart data={metrics.customerSatisfaction.trend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    name="Satisfaction"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Rating Distribution</CardTitle>
            <CardDescription>
              Distribution of customer ratings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.customerSatisfaction.distribution}>
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
          </CardContent>
        </Card>
      </div>

      {/* Quality Checks and Issue Resolution */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quality Check Results</CardTitle>
            <CardDescription>
              Pass/fail rates by service category
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={metrics.qualityChecks.byCategory}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="category" type="category" />
                  <Tooltip />
                  <Legend />
                  <Bar
                    dataKey="passRate"
                    fill="#82ca9d"
                    name="Pass Rate (%)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Issue Resolution by Category</CardTitle>
            <CardDescription>
              Resolution rates across service categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={metrics.issueResolution.byCategory}
                    dataKey="resolutionRate"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {metrics.issueResolution.byCategory.map((entry, index) => (
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

      {/* Active Issues */}
      <Card>
        <CardHeader>
          <CardTitle>Active Quality Issues</CardTitle>
          <CardDescription>
            Current service quality issues requiring attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {issues.map((issue) => (
              <div
                key={issue.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <h4 className="font-medium">{issue.type}</h4>
                  <p className="text-sm text-gray-500">{issue.description}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Badge
                      variant={
                        issue.severity === 'high'
                          ? 'destructive'
                          : issue.severity === 'medium'
                          ? 'secondary'
                          : 'default'
                      }
                    >
                      {issue.severity}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Created: {format(new Date(issue.createdAt), 'PPp')}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <Select
                    value={issue.status}
                    onValueChange={(value) =>
                      handleIssueStatusUpdate(issue.id, value)
                    }
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Update status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
