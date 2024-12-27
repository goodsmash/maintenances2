import { useState, useEffect } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { serviceCategories } from '@/data/serviceCategories';
import { api } from '@/lib/api';

interface Contractor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specializations: string[];
  qualifications: string[];
  rating: number;
  completedJobs: number;
  status: 'active' | 'inactive' | 'pending' | 'suspended';
  availability: {
    schedule: {
      day: string;
      startTime: string;
      endTime: string;
    }[];
    serviceAreas: string[];
  };
  insurance: {
    provider: string;
    policyNumber: string;
    expiryDate: string;
    coverage: number;
  };
  documents: {
    type: string;
    url: string;
    verified: boolean;
  }[];
}

const contractorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  specializations: z.array(z.string()).min(1, 'At least one specialization is required'),
  qualifications: z.array(z.string()).min(1, 'At least one qualification is required'),
  status: z.enum(['active', 'inactive', 'pending', 'suspended']),
  availability: z.object({
    schedule: z.array(
      z.object({
        day: z.string(),
        startTime: z.string(),
        endTime: z.string(),
      })
    ),
    serviceAreas: z.array(z.string()).min(1, 'At least one service area is required'),
  }),
  insurance: z.object({
    provider: z.string().min(1, 'Insurance provider is required'),
    policyNumber: z.string().min(1, 'Policy number is required'),
    expiryDate: z.string(),
    coverage: z.number().min(0, 'Coverage amount must be positive'),
  }),
});

type ContractorFormData = z.infer<typeof contractorSchema>;

export function ContractorManagement() {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [editingContractor, setEditingContractor] = useState<Contractor | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContractorFormData>({
    resolver: zodResolver(contractorSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      specializations: [],
      qualifications: [],
      status: 'pending',
      availability: {
        schedule: [],
        serviceAreas: [],
      },
      insurance: {
        provider: '',
        policyNumber: '',
        expiryDate: '',
        coverage: 0,
      },
    },
  });

  useEffect(() => {
    loadContractors();
  }, []);

  const loadContractors = async () => {
    try {
      setLoading(true);
      const response = await api.getContractors();
      setContractors(response);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load contractors',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ContractorFormData) => {
    try {
      setLoading(true);
      if (editingContractor) {
        await api.updateContractor(editingContractor.id, data);
        toast({
          title: 'Success',
          description: 'Contractor updated successfully',
        });
      } else {
        await api.createContractor(data);
        toast({
          title: 'Success',
          description: 'Contractor created successfully',
        });
      }
      setIsDialogOpen(false);
      loadContractors();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save contractor',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (contractor: Contractor) => {
    setEditingContractor(contractor);
    form.reset({
      name: contractor.name,
      email: contractor.email,
      phone: contractor.phone,
      specializations: contractor.specializations,
      qualifications: contractor.qualifications,
      status: contractor.status,
      availability: contractor.availability,
      insurance: contractor.insurance,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (contractorId: string) => {
    if (!confirm('Are you sure you want to delete this contractor?')) return;

    try {
      setLoading(true);
      await api.deleteContractor(contractorId);
      toast({
        title: 'Success',
        description: 'Contractor deleted successfully',
      });
      loadContractors();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete contractor',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: Contractor['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'secondary';
      case 'pending':
        return 'warning';
      case 'suspended':
        return 'destructive';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Contractor Management</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingContractor(null);
                form.reset();
              }}
            >
              Add New Contractor
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingContractor ? 'Edit Contractor' : 'Add New Contractor'}
              </DialogTitle>
              <DialogDescription>
                {editingContractor
                  ? 'Update the contractor details below'
                  : 'Fill in the contractor details below'}
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="inactive">Inactive</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="suspended">Suspended</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="specializations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Specializations</FormLabel>
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
                          placeholder="Enter specializations (one per line)"
                        />
                      </FormControl>
                      <FormDescription>
                        Enter each specialization on a new line
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="qualifications"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qualifications</FormLabel>
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

                <div className="space-y-4">
                  <h3 className="font-medium">Insurance Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="insurance.provider"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Insurance Provider</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="insurance.policyNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Policy Number</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="insurance.expiryDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="insurance.coverage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Coverage Amount</FormLabel>
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
                </div>

                <FormField
                  control={form.control}
                  name="availability.serviceAreas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Areas</FormLabel>
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
                          placeholder="Enter service areas (one per line)"
                        />
                      </FormControl>
                      <FormDescription>
                        Enter each service area on a new line (e.g., city, state or
                        zip code)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading
                      ? 'Saving...'
                      : editingContractor
                      ? 'Update Contractor'
                      : 'Create Contractor'}
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
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Completed Jobs</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contractors.map((contractor) => (
              <TableRow key={contractor.id}>
                <TableCell className="font-medium">
                  {contractor.name}
                </TableCell>
                <TableCell>{contractor.email}</TableCell>
                <TableCell>{contractor.phone}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(contractor.status)}>
                    {contractor.status}
                  </Badge>
                </TableCell>
                <TableCell>{contractor.rating.toFixed(1)}/5.0</TableCell>
                <TableCell>{contractor.completedJobs}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(contractor)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(contractor.id)}
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
