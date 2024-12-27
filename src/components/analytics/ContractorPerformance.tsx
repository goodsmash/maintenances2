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
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { format, subDays } from 'date-fns';
import { Download, Star, Clock, DollarSign, UserCheck } from 'lucide-react';
import { api } from '@/lib/api';

interface ContractorMetrics {
  id: string;
  name: string;
  photo?: string;
  overallRating: number;
  totalServices: number;
  completionRate: number;
  onTimeRate: number;
  customerSatisfaction: number;
  revenueGenerated: number;
  qualityScore: number;
  responseTime: string;
  availability: number;
  skills: {
    name: string;
    level: number;
  }[];
  performanceTrend: {
    date: string;
    rating: number;
    services: number;
    revenue: number;
  }[];
  serviceBreakdown: {
    category: string;
    count: number;
    rating: number;
  }[];
  customerFeedback: {
    positive: number;
    neutral: number;
    negative: number;
    recentReviews: {
      id: string;
      rating: number;
      comment: string;
      date: string;
      serviceType: string;
    }[];
  };
  certifications: {
    name: string;
    status: 'active' | 'expired' | 'pending';
    expiryDate: string;
  }[];
  complianceStatus: {
    insurance: boolean;
    background: boolean;
    training: boolean;
    documents: boolean;
  };
}

export function ContractorPerformance() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedContractor, setSelectedContractor] = useState<string>('');
  const [contractors, setContractors] = useState<ContractorMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadContractors();
  }, [timeRange]);

  const loadContractors = async () => {
    try {
      setLoading(true);
      const response = await api.getContractorPerformance(timeRange);
      setContractors(response);
      if (response.length > 0 && !selectedContractor) {
        setSelectedContractor(response[0].id);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load contractor performance data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const selectedContractorData = contractors.find(
    (c) => c.id === selectedContractor
  );

  const exportPerformanceReport = async () => {
    try {
      const response = await api.exportContractorReport(
        selectedContractor,
        timeRange
      );
      const url = window.URL.createObjectURL(new Blob([response]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `contractor-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast({
        title: 'Export Failed',
        description: 'Failed to export performance report',
        variant: 'destructive',
      });
    }
  };

  if (loading || !selectedContractorData) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Select
            value={selectedContractor}
            onValueChange={setSelectedContractor}
          >
            <SelectTrigger className="w-[250px]">
              <SelectValue placeholder="Select contractor" />
            </SelectTrigger>
            <SelectContent>
              {contractors.map((contractor) => (
                <SelectItem key={contractor.id} value={contractor.id}>
                  {contractor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
        <Button onClick={exportPerformanceReport}>
          <Download className="h-4 w-4 mr-2" />
          Export Report
        </Button>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Overall Rating
            </CardTitle>
            <Star className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {selectedContractorData.overallRating.toFixed(1)}/5.0
            </div>
            <p className="text-xs text-muted-foreground">
              Based on {selectedContractorData.totalServices} services
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completion Rate
            </CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(selectedContractorData.completionRate * 100).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Of assigned services
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Response Time
            </CardTitle>
            <Clock className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {selectedContractorData.responseTime}
            </div>
            <p className="text-xs text-muted-foreground">
              Average response time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Revenue Generated
            </CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${selectedContractorData.revenueGenerated.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              In selected period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trends */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
            <CardDescription>
              Rating and service volume over time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={selectedContractorData.performanceTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" domain={[0, 5]} />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="rating"
                    stroke="#8884d8"
                    name="Rating"
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="services"
                    stroke="#82ca9d"
                    name="Services"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Category Performance</CardTitle>
            <CardDescription>
              Rating distribution by service type
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={selectedContractorData.serviceBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="rating" fill="#8884d8" name="Rating" />
                  <Bar dataKey="count" fill="#82ca9d" name="Services" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skills and Certifications */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Skills Assessment</CardTitle>
            <CardDescription>
              Competency levels across different skills
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  data={selectedContractorData.skills}
                >
                  <PolarGrid />
                  <PolarAngleAxis dataKey="name" />
                  <PolarRadiusAxis domain={[0, 5]} />
                  <Radar
                    name="Skills"
                    dataKey="level"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Certifications & Compliance</CardTitle>
            <CardDescription>
              Status of required certifications and compliance items
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {selectedContractorData.certifications.map((cert) => (
                <div
                  key={cert.name}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{cert.name}</p>
                    <p className="text-sm text-gray-500">
                      Expires: {format(new Date(cert.expiryDate), 'PP')}
                    </p>
                  </div>
                  <Badge
                    variant={
                      cert.status === 'active'
                        ? 'default'
                        : cert.status === 'expired'
                        ? 'destructive'
                        : 'secondary'
                    }
                  >
                    {cert.status}
                  </Badge>
                </div>
              ))}

              <div className="mt-6">
                <h4 className="font-medium mb-4">Compliance Status</h4>
                <div className="space-y-2">
                  {Object.entries(selectedContractorData.complianceStatus).map(
                    ([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <span className="capitalize">
                          {key.replace('_', ' ')}
                        </span>
                        <Badge
                          variant={value ? 'default' : 'destructive'}
                        >
                          {value ? 'Compliant' : 'Non-Compliant'}
                        </Badge>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Feedback */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Customer Feedback</CardTitle>
          <CardDescription>
            Latest reviews and feedback from customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <p className="text-sm font-medium">Feedback Distribution</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-green-600">
                      {selectedContractorData.customerFeedback.positive}% Positive
                    </span>
                    <span className="text-sm text-yellow-600">
                      {selectedContractorData.customerFeedback.neutral}% Neutral
                    </span>
                    <span className="text-sm text-red-600">
                      {selectedContractorData.customerFeedback.negative}% Negative
                    </span>
                  </div>
                </div>
                <Progress
                  value={selectedContractorData.customerFeedback.positive}
                  className="w-[200px]"
                />
              </div>
            </div>

            <div className="space-y-4">
              {selectedContractorData.customerFeedback.recentReviews.map(
                (review) => (
                  <div
                    key={review.id}
                    className="p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">
                          {review.serviceType}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {format(new Date(review.date), 'PP')}
                      </span>
                    </div>
                    <p className="mt-2 text-gray-600">{review.comment}</p>
                  </div>
                )
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
