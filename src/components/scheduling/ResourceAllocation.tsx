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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
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
  LineChart,
  Line,
} from 'recharts';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  RefreshCw,
} from 'lucide-react';
import { format, addHours, isSameDay } from 'date-fns';
import { api } from '@/lib/api';

interface Resource {
  id: string;
  name: string;
  type: 'contractor' | 'equipment' | 'vehicle';
  skills: string[];
  availability: {
    date: string;
    slots: {
      start: string;
      end: string;
      status: 'available' | 'booked' | 'maintenance';
    }[];
  }[];
  currentLoad: number;
  maxCapacity: number;
  efficiency: number;
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  status: 'active' | 'inactive' | 'maintenance';
  nextMaintenance?: string;
  certifications: {
    name: string;
    expiryDate: string;
    status: 'valid' | 'expired' | 'expiring';
  }[];
}

interface Assignment {
  id: string;
  resourceId: string;
  serviceId: string;
  customerId: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  notes?: string;
}

interface OptimizationMetrics {
  resourceUtilization: number;
  averageResponseTime: string;
  completionRate: number;
  travelTime: string;
  customerSatisfaction: number;
  costEfficiency: number;
  trends: {
    date: string;
    utilization: number;
    satisfaction: number;
  }[];
}

export function ResourceAllocation() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [metrics, setMetrics] = useState<OptimizationMetrics | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedResource, setSelectedResource] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [optimizing, setOptimizing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [resourcesData, assignmentsData, metricsData] = await Promise.all([
        api.getResources(),
        api.getAssignments(format(selectedDate, 'yyyy-MM-dd')),
        api.getOptimizationMetrics(),
      ]);
      setResources(resourcesData);
      setAssignments(assignmentsData);
      setMetrics(metricsData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load resource allocation data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const optimizeSchedule = async () => {
    try {
      setOptimizing(true);
      const optimizedAssignments = await api.optimizeSchedule({
        date: format(selectedDate, 'yyyy-MM-dd'),
        resourceId: selectedResource || undefined,
      });
      setAssignments(optimizedAssignments);
      toast({
        title: 'Success',
        description: 'Schedule optimized successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to optimize schedule',
        variant: 'destructive',
      });
    } finally {
      setOptimizing(false);
    }
  };

  const handleAssignmentUpdate = async (
    assignmentId: string,
    status: string
  ) => {
    try {
      await api.updateAssignment(assignmentId, { status });
      loadData();
      toast({
        title: 'Success',
        description: 'Assignment updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update assignment',
        variant: 'destructive',
      });
    }
  };

  const getResourceUtilizationColor = (utilization: number) => {
    if (utilization < 50) return 'text-yellow-500';
    if (utilization < 80) return 'text-green-500';
    return 'text-red-500';
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resource Allocation</h2>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            onClick={optimizeSchedule}
            disabled={optimizing}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {optimizing ? 'Optimizing...' : 'Optimize Schedule'}
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Optimization Metrics */}
      {metrics && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Resource Utilization
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.resourceUtilization.toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">
                Average across all resources
              </div>
              <Progress
                value={metrics.resourceUtilization}
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Response Time
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {metrics.averageResponseTime}
              </div>
              <div className="text-xs text-muted-foreground">
                Average response time
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completion Rate
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(metrics.completionRate * 100).toFixed(1)}%
              </div>
              <div className="text-xs text-muted-foreground">
                Of scheduled services
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Resource Calendar and List */}
      <div className="grid gap-6 md:grid-cols-12">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Resources</CardTitle>
            <CardDescription>
              Available resources and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resources.map((resource) => (
                <div
                  key={resource.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{resource.name}</h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge
                        variant={
                          resource.status === 'active'
                            ? 'default'
                            : resource.status === 'maintenance'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {resource.status}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {resource.type}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`font-medium ${getResourceUtilizationColor(
                        resource.currentLoad
                      )}`}
                    >
                      {resource.currentLoad}% Load
                    </div>
                    <div className="text-sm text-gray-500">
                      {resource.location.address}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Schedule</CardTitle>
                <CardDescription>
                  Resource assignments and availability
                </CardDescription>
              </div>
              <div className="flex items-center space-x-4">
                <Select
                  value={selectedResource}
                  onValueChange={setSelectedResource}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="All resources" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All resources</SelectItem>
                    {resources.map((resource) => (
                      <SelectItem key={resource.id} value={resource.id}>
                        {resource.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  className="rounded-md border"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {assignments
                .filter(
                  (assignment) =>
                    !selectedResource ||
                    assignment.resourceId === selectedResource
                )
                .map((assignment) => {
                  const resource = resources.find(
                    (r) => r.id === assignment.resourceId
                  );
                  return (
                    <div
                      key={assignment.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">
                            {resource?.name || 'Unknown Resource'}
                          </h4>
                          <Badge
                            variant={
                              assignment.priority === 'urgent'
                                ? 'destructive'
                                : assignment.priority === 'high'
                                ? 'secondary'
                                : 'default'
                            }
                          >
                            {assignment.priority}
                          </Badge>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {format(
                            new Date(assignment.startTime),
                            'h:mm a'
                          )}{' '}
                          -{' '}
                          {format(new Date(assignment.endTime), 'h:mm a')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {assignment.location.address}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <Badge
                          variant={
                            assignment.status === 'completed'
                              ? 'default'
                              : assignment.status === 'in-progress'
                              ? 'secondary'
                              : assignment.status === 'cancelled'
                              ? 'destructive'
                              : 'outline'
                          }
                        >
                          {assignment.status}
                        </Badge>
                        <Select
                          value={assignment.status}
                          onValueChange={(value) =>
                            handleAssignmentUpdate(assignment.id, value)
                          }
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Update status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="scheduled">
                              Scheduled
                            </SelectItem>
                            <SelectItem value="in-progress">
                              In Progress
                            </SelectItem>
                            <SelectItem value="completed">
                              Completed
                            </SelectItem>
                            <SelectItem value="cancelled">
                              Cancelled
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  );
                })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Metrics</CardTitle>
            <CardDescription>
              Resource allocation and optimization metrics
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="utilization">
              <TabsList>
                <TabsTrigger value="utilization">
                  Resource Utilization
                </TabsTrigger>
                <TabsTrigger value="satisfaction">
                  Customer Satisfaction
                </TabsTrigger>
              </TabsList>
              <TabsContent value="utilization">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics.trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="utilization"
                        stroke="#8884d8"
                        name="Resource Utilization"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              <TabsContent value="satisfaction">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={metrics.trends}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="satisfaction"
                        stroke="#82ca9d"
                        name="Customer Satisfaction"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
