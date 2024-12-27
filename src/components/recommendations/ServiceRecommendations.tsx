import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Lightbulb,
  Calendar,
  Clock,
  DollarSign,
  Star,
  AlertTriangle,
  CheckCircle,
  Tool,
  ThumbsUp,
  Activity,
} from 'lucide-react';
import { format } from 'date-fns';
import { api } from '@/lib/api';

interface ServiceRecommendation {
  id: string;
  customerId: string;
  serviceType: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  reason: string;
  estimatedCost: {
    min: number;
    max: number;
  };
  suggestedSchedule: {
    earliestDate: string;
    latestDate: string;
  };
  potentialIssues: string[];
  preventiveMeasures: string[];
  confidence: number;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  seasonality: {
    bestMonths: string[];
    worstMonths: string[];
  };
  relatedServices: {
    serviceType: string;
    correlation: number;
  }[];
}

interface Customer {
  id: string;
  name: string;
  propertyType: string;
  lastService: string;
  serviceHistory: {
    date: string;
    type: string;
    cost: number;
    rating?: number;
  }[];
  preferences: {
    preferredDays: string[];
    preferredTimes: string[];
    budget: {
      min: number;
      max: number;
    };
  };
}

interface RecommendationMetrics {
  totalRecommendations: number;
  acceptanceRate: number;
  averageConfidence: number;
  customerSatisfaction: number;
  recommendationsByType: {
    type: string;
    count: number;
  }[];
  monthlyTrends: {
    month: string;
    recommendations: number;
    acceptances: number;
  }[];
  savingsGenerated: number;
  issuesPreventedCount: number;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export function ServiceRecommendations() {
  const [recommendations, setRecommendations] = useState<
    ServiceRecommendation[]
  >([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [metrics, setMetrics] = useState<RecommendationMetrics | null>(
    null
  );
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [selectedCustomer]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [recommendationsData, customersData, metricsData] =
        await Promise.all([
          api.getServiceRecommendations(selectedCustomer),
          api.getCustomers(),
          api.getRecommendationMetrics(),
        ]);
      setRecommendations(recommendationsData);
      setCustomers(customersData);
      setMetrics(metricsData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load recommendations data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRecommendationAction = async (
    recommendationId: string,
    action: 'accept' | 'decline'
  ) => {
    try {
      await api.updateRecommendation(recommendationId, action);
      loadData();
      toast({
        title: 'Success',
        description: `Recommendation ${action}ed successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} recommendation`,
        variant: 'destructive',
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'urgent':
        return 'text-red-500';
      case 'high':
        return 'text-orange-500';
      case 'medium':
        return 'text-yellow-500';
      default:
        return 'text-green-500';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Service Recommendations</h2>
        <Select
          value={selectedCustomer}
          onValueChange={setSelectedCustomer}
        >
          <SelectTrigger className="w-[250px]">
            <SelectValue placeholder="Select customer" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Customers</SelectItem>
            {customers.map((customer) => (
              <SelectItem key={customer.id} value={customer.id}>
                {customer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Recommendation Metrics */}
      {metrics && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Recommendations
              </CardTitle>
              <Lightbulb className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.totalRecommendations.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                {(metrics.acceptanceRate * 100).toFixed(1)}% acceptance
                rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Confidence
              </CardTitle>
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(metrics.averageConfidence * 100).toFixed(1)}%
              </div>
              <Progress
                value={metrics.averageConfidence * 100}
                className="mt-2"
              />
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
                {metrics.customerSatisfaction.toFixed(1)}/5.0
              </div>
              <p className="text-xs text-muted-foreground">
                Based on accepted recommendations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Issues Prevented
              </CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.issuesPreventedCount.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground">
                ${metrics.savingsGenerated.toLocaleString()} saved
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recommendations Distribution */}
      {metrics && (
        <div className="grid gap-6 md:grid-cols-12">
          <Card className="md:col-span-4">
            <CardHeader>
              <CardTitle>Recommendations by Type</CardTitle>
              <CardDescription>
                Distribution of service recommendations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={metrics.recommendationsByType}
                      dataKey="count"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {metrics.recommendationsByType.map(
                        (entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        )
                      )}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-8">
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
              <CardDescription>
                Recommendation and acceptance trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics.monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="recommendations"
                      fill="#8884d8"
                      name="Recommendations"
                    />
                    <Bar
                      dataKey="acceptances"
                      fill="#82ca9d"
                      name="Acceptances"
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Active Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Active Recommendations</CardTitle>
          <CardDescription>
            Current service recommendations for customers
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {recommendations.map((recommendation) => {
              const customer = customers.find(
                (c) => c.id === recommendation.customerId
              );
              return (
                <div
                  key={recommendation.id}
                  className="border rounded-lg p-6 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">
                        {customer?.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {recommendation.serviceType}
                      </p>
                    </div>
                    <Badge
                      className={getPriorityColor(
                        recommendation.priority
                      )}
                    >
                      {recommendation.priority} Priority
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Recommendation Details
                      </h4>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-gray-400" />
                          <span>
                            Estimated Cost: $
                            {recommendation.estimatedCost.min.toLocaleString()}{' '}
                            - $
                            {recommendation.estimatedCost.max.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>
                            Suggested Schedule:{' '}
                            {format(
                              new Date(
                                recommendation.suggestedSchedule
                                  .earliestDate
                              ),
                              'PP'
                            )}{' '}
                            -{' '}
                            {format(
                              new Date(
                                recommendation.suggestedSchedule
                                  .latestDate
                              ),
                              'PP'
                            )}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <ThumbsUp className="h-4 w-4 text-gray-400" />
                          <span>
                            Confidence:{' '}
                            {(recommendation.confidence * 100).toFixed(
                              1
                            )}
                            %
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Potential Issues
                      </h4>
                      <ul className="space-y-1">
                        {recommendation.potentialIssues.map(
                          (issue, index) => (
                            <li
                              key={index}
                              className="text-sm text-gray-600 flex items-center space-x-2"
                            >
                              <AlertTriangle className="h-4 w-4 text-yellow-500" />
                              <span>{issue}</span>
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Preventive Measures
                    </h4>
                    <ul className="space-y-1">
                      {recommendation.preventiveMeasures.map(
                        (measure, index) => (
                          <li
                            key={index}
                            className="text-sm text-gray-600 flex items-center space-x-2"
                          >
                            <Tool className="h-4 w-4 text-blue-500" />
                            <span>{measure}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Related Services
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {recommendation.relatedServices.map(
                        (service, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="flex items-center space-x-1"
                          >
                            <span>{service.serviceType}</span>
                            <span className="text-xs text-gray-500">
                              ({(service.correlation * 100).toFixed(1)}%
                              correlation)
                            </span>
                          </Badge>
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button
                      variant="outline"
                      onClick={() =>
                        handleRecommendationAction(
                          recommendation.id,
                          'decline'
                        )
                      }
                    >
                      Decline
                    </Button>
                    <Button
                      onClick={() =>
                        handleRecommendationAction(
                          recommendation.id,
                          'accept'
                        )
                      }
                    >
                      Accept Recommendation
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
