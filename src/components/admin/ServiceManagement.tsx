import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
  FormDescription,
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { serviceCategories, ServiceCategory, Service } from '@/data/serviceCategories';
import { api } from '@/lib/api';

const serviceSchema = z.object({
  categoryId: z.string().min(1, 'Category is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  estimatedDuration: z.string().min(1, 'Duration is required'),
  priceRange: z.object({
    min: z.number().min(0, 'Minimum price must be positive'),
    max: z.number().min(0, 'Maximum price must be positive'),
  }),
  requiredQualifications: z.array(z.string()).min(1, 'At least one qualification is required'),
  commonIssues: z.array(z.string()).min(1, 'At least one common issue is required'),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

export function ServiceManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      categoryId: '',
      name: '',
      description: '',
      estimatedDuration: '',
      priceRange: {
        min: 0,
        max: 0,
      },
      requiredQualifications: [],
      commonIssues: [],
    },
  });

  const loadServices = async () => {
    try {
      setLoading(true);
      const response = await api.getServices();
      setServices(response);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load services',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ServiceFormData) => {
    try {
      setLoading(true);
      if (editingService) {
        await api.updateService(editingService.id, data);
        toast({
          title: 'Success',
          description: 'Service updated successfully',
        });
      } else {
        await api.createService(data);
        toast({
          title: 'Success',
          description: 'Service created successfully',
        });
      }
      setIsDialogOpen(false);
      loadServices();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save service',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service: Service) => {
    setEditingService(service);
    form.reset({
      categoryId: service.categoryId,
      name: service.name,
      description: service.description,
      estimatedDuration: service.estimatedDuration,
      priceRange: service.priceRange,
      requiredQualifications: service.requiredQualifications,
      commonIssues: service.commonIssues,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) return;

    try {
      setLoading(true);
      await api.deleteService(serviceId);
      toast({
        title: 'Success',
        description: 'Service deleted successfully',
      });
      loadServices();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete service',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Service Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingService(null);
              form.reset();
            }}>
              Add New Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingService ? 'Edit Service' : 'Add New Service'}
              </DialogTitle>
              <DialogDescription>
                {editingService
                  ? 'Update the service details below'
                  : 'Fill in the service details below'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="categoryId"
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
                          {serviceCategories.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="priceRange.min"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priceRange.max"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) =>
                              field.onChange(parseFloat(e.target.value))
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
                  name="estimatedDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estimated Duration</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g., 2-3 hours" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requiredQualifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Required Qualifications</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value.join('\n')}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                .split('\n')
                                .filter((line) => line.trim())
                            )
                          }
                          placeholder="Enter qualifications (one per line)"
                        />
                      </FormControl>
                      <FormDescription>
                        Enter each qualification on a new line
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="commonIssues"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Common Issues</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value.join('\n')}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                .split('\n')
                                .filter((line) => line.trim())
                            )
                          }
                          placeholder="Enter common issues (one per line)"
                        />
                      </FormControl>
                      <FormDescription>
                        Enter each issue on a new line
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading
                      ? 'Saving...'
                      : editingService
                      ? 'Update Service'
                      : 'Create Service'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price Range</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell>
                  {
                    serviceCategories.find(
                      (cat) => cat.id === service.categoryId
                    )?.name
                  }
                </TableCell>
                <TableCell>
                  ${service.priceRange.min} - ${service.priceRange.max}
                </TableCell>
                <TableCell>{service.estimatedDuration}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(service)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(service.id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
