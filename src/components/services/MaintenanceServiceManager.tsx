import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Settings,
  Plus,
  Edit,
  Trash2,
  Calendar,
  Users,
  Tool,
  Clock,
  DollarSign,
  BarChart2,
  FileText,
  CheckCircle,
  AlertTriangle,
  Package,
} from 'lucide-react';
import { format } from 'date-fns';

interface MaintenanceService {
  id: string;
  name: string;
  category: string;
  description: string;
  duration: number;
  price: number;
  status: 'active' | 'inactive';
  requirements: {
    tools: string[];
    skills: string[];
    certifications: string[];
  };
  procedures: {
    steps: string[];
    safetyGuidelines: string[];
    qualityChecks: string[];
  };
  metrics: {
    completionRate: number;
    customerSatisfaction: number;
    averageTime: number;
    revenueGenerated: number;
  };
}

interface ServiceProvider {
  id: string;
  name: string;
  specialties: string[];
  certifications: string[];
  rating: number;
  availability: {
    schedule: Record<string, string[]>;
    nextAvailable: string;
  };
  completedServices: number;
  activeJobs: number;
}

const serviceSchema = z.object({
  name: z.string().min(1, 'Service name is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  duration: z.number().min(1, 'Duration must be greater than 0'),
  price: z.number().min(0, 'Price must be non-negative'),
  requirements: z.object({
    tools: z.array(z.string()),
    skills: z.array(z.string()),
    certifications: z.array(z.string()),
  }),
  procedures: z.object({
    steps: z.array(z.string()),
    safetyGuidelines: z.array(z.string()),
    qualityChecks: z.array(z.string()),
  }),
});

export function MaintenanceServiceManager() {
  const [services, setServices] = useState<MaintenanceService[]>([]);
  const [providers, setProviders] = useState<ServiceProvider[]>([]);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      duration: 60,
      price: 0,
      requirements: {
        tools: [],
        skills: [],
        certifications: [],
      },
      procedures: {
        steps: [],
        safetyGuidelines: [],
        qualityChecks: [],
      },
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [servicesData, providersData] = await Promise.all([
        fetch('/api/services').then((res) => res.json()),
        fetch('/api/providers').then((res) => res.json()),
      ]);
      setServices(servicesData);
      setProviders(providersData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load service data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof serviceSchema>) => {
    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create service');

      setIsCreateOpen(false);
      loadData();
      toast({
        title: 'Success',
        description: 'Service created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create service',
        variant: 'destructive',
      });
    }
  };

  const handleServiceAction = async (
    serviceId: string,
    action: 'edit' | 'delete' | 'toggle'
  ) => {
    try {
      if (action === 'delete') {
        await fetch(`/api/services/${serviceId}`, {
          method: 'DELETE',
        });
        loadData();
        toast({
          title: 'Success',
          description: 'Service deleted successfully',
        });
      } else if (action === 'toggle') {
        await fetch(`/api/services/${serviceId}/toggle`, {
          method: 'POST',
        });
        loadData();
        toast({
          title: 'Success',
          description: 'Service status updated successfully',
        });
      } else {
        setSelectedService(serviceId);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} service`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Maintenance Service Management</h2>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Service
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Maintenance Service</DialogTitle>
                <DialogDescription>
                  Create a new maintenance service
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Service Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="hvac">HVAC</SelectItem>
                              <SelectItem value="plumbing">Plumbing</SelectItem>
                              <SelectItem value="electrical">
                                Electrical
                              </SelectItem>
                              <SelectItem value="general">
                                General Maintenance
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Duration (minutes)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price ($)</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              step="0.01"
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="submit">Create Service</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Services
            </CardTitle>
            <Tool className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{services.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {new Set(services.map((s) => s.category)).size}{' '}
              categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Providers
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providers.length}</div>
            <p className="text-xs text-muted-foreground">
              {providers.reduce((acc, p) => acc + p.activeJobs, 0)} active
              jobs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                providers.reduce((acc, p) => acc + p.rating, 0) /
                providers.length
              ).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Customer satisfaction
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {services
                .reduce((acc, s) => acc + s.metrics.revenueGenerated, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              From all services
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Maintenance Services</CardTitle>
          <CardDescription>
            Manage your maintenance service offerings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Service</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Metrics</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{service.name}</div>
                      <div className="text-sm text-gray-500">
                        {service.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{service.category}</Badge>
                  </TableCell>
                  <TableCell>
                    {service.duration} minutes
                  </TableCell>
                  <TableCell>${service.price}</TableCell>
                  <TableCell>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span>Completion Rate:</span>
                        <span>{service.metrics.completionRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Satisfaction:</span>
                        <span>
                          {service.metrics.customerSatisfaction.toFixed(1)}/5
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        service.status === 'active'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {service.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleServiceAction(service.id, 'edit')
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleServiceAction(service.id, 'toggle')
                        }
                      >
                        {service.status === 'active' ? (
                          <AlertTriangle className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleServiceAction(service.id, 'delete')
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Service Providers</CardTitle>
            <CardDescription>
              Active maintenance service providers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {providers.map((provider) => (
                <div
                  key={provider.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <div className="font-medium">{provider.name}</div>
                    <div className="text-sm text-gray-500">
                      {provider.specialties.join(', ')}
                    </div>
                    <div className="mt-2 flex items-center space-x-4 text-sm">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        {provider.rating.toFixed(1)}
                      </div>
                      <div>
                        {provider.completedServices} services completed
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      Next Available
                    </div>
                    <div className="text-sm text-gray-500">
                      {format(
                        new Date(provider.availability.nextAvailable),
                        'PP'
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Service Analytics</CardTitle>
            <CardDescription>
              Performance metrics and insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              <div>
                <div className="text-sm font-medium mb-2">
                  Service Completion Rates
                </div>
                <div className="space-y-2">
                  {Object.entries(
                    services.reduce((acc, service) => {
                      const cat = service.category;
                      if (!acc[cat]) acc[cat] = [];
                      acc[cat].push(service.metrics.completionRate);
                      return acc;
                    }, {} as Record<string, number[]>)
                  ).map(([category, rates]) => (
                    <div key={category}>
                      <div className="flex justify-between text-sm">
                        <span>{category}</span>
                        <span>
                          {(
                            rates.reduce((a, b) => a + b, 0) /
                            rates.length
                          ).toFixed(1)}
                          %
                        </span>
                      </div>
                      <Progress
                        value={
                          rates.reduce((a, b) => a + b, 0) / rates.length
                        }
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="text-sm font-medium mb-2">
                  Revenue by Category
                </div>
                <div className="space-y-2">
                  {Object.entries(
                    services.reduce((acc, service) => {
                      const cat = service.category;
                      if (!acc[cat]) acc[cat] = 0;
                      acc[cat] += service.metrics.revenueGenerated;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([category, revenue]) => (
                    <div key={category}>
                      <div className="flex justify-between text-sm">
                        <span>{category}</span>
                        <span>${revenue.toLocaleString()}</span>
                      </div>
                      <Progress
                        value={
                          (revenue /
                            services.reduce(
                              (acc, s) =>
                                acc + s.metrics.revenueGenerated,
                              0
                            )) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
