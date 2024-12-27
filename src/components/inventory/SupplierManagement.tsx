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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Building2,
  Package,
  TrendingUp,
  DollarSign,
  Clock,
  Star,
  AlertTriangle,
  CheckCircle,
  Truck,
  FileText,
  Phone,
  Mail,
  MapPin,
  Edit,
  Trash2,
  Plus,
} from 'lucide-react';
import { format } from 'date-fns';

interface Supplier {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'inactive' | 'pending';
  contact: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
  performance: {
    rating: number;
    onTimeDelivery: number;
    qualityScore: number;
    responseTime: number;
  };
  financial: {
    totalSpent: number;
    outstandingBalance: number;
    paymentTerms: string;
    currency: string;
  };
  compliance: {
    certifications: string[];
    insuranceStatus: string;
    lastAuditDate: string;
    nextAuditDue: string;
  };
  products: {
    id: string;
    name: string;
    category: string;
    price: number;
    leadTime: number;
    minimumOrder: number;
  }[];
  orders: {
    id: string;
    date: string;
    status: string;
    total: number;
    items: number;
  }[];
  documents: {
    id: string;
    type: string;
    name: string;
    date: string;
    status: string;
  }[];
}

const supplierSchema = z.object({
  name: z.string().min(1, 'Supplier name is required'),
  type: z.string(),
  contact: z.object({
    name: z.string().min(1, 'Contact name is required'),
    email: z.string().email('Invalid email address'),
    phone: z.string().min(1, 'Phone number is required'),
    address: z.string().min(1, 'Address is required'),
  }),
  paymentTerms: z.string(),
  certifications: z.array(z.string()),
});

export function SupplierManagement() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof supplierSchema>>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      type: 'regular',
      certifications: [],
    },
  });

  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/suppliers');
      const data = await response.json();
      setSuppliers(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load suppliers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof supplierSchema>) => {
    try {
      const response = await fetch('/api/suppliers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to create supplier');
      
      setIsCreateOpen(false);
      loadSuppliers();
      toast({
        title: 'Success',
        description: 'Supplier created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create supplier',
        variant: 'destructive',
      });
    }
  };

  const handleSupplierAction = async (
    supplierId: string,
    action: 'activate' | 'deactivate' | 'delete'
  ) => {
    try {
      const response = await fetch(`/api/suppliers/${supplierId}/${action}`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error(`Failed to ${action} supplier`);
      
      loadSuppliers();
      toast({
        title: 'Success',
        description: `Supplier ${action}d successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} supplier`,
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Supplier Management</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Supplier
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Supplier</DialogTitle>
              <DialogDescription>
                Enter supplier details below
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Supplier Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="contact.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contact Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contact.phone"
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
                    name="contact.address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button type="submit">Create Supplier</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Suppliers
            </CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.length}</div>
            <p className="text-xs text-muted-foreground">
              {suppliers.filter(s => s.status === 'active').length} active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Rating
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(suppliers.reduce((acc, s) => acc + s.performance.rating, 0) / suppliers.length || 0).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">
              Based on performance metrics
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Spend
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${suppliers.reduce((acc, s) => acc + s.financial.totalSpent, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Year to date
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              On-Time Delivery
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(suppliers.reduce((acc, s) => acc + s.performance.onTimeDelivery, 0) / suppliers.length || 0).toFixed(1)}%
            </div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Suppliers</CardTitle>
          <CardDescription>
            Manage your suppliers and their performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Supplier</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Financial</TableHead>
                <TableHead>Compliance</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{supplier.name}</div>
                      <div className="text-sm text-gray-500">
                        {supplier.type}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        supplier.status === 'active'
                          ? 'default'
                          : supplier.status === 'inactive'
                          ? 'secondary'
                          : 'outline'
                      }
                    >
                      {supplier.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span>{supplier.performance.rating.toFixed(1)}</span>
                      </div>
                      <div className="text-sm text-gray-500">
                        {supplier.performance.onTimeDelivery}% on-time
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        ${supplier.financial.totalSpent.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-500">
                        {supplier.financial.paymentTerms}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {supplier.compliance.certifications.map((cert, index) => (
                        <Badge key={index} variant="outline" className="mr-1">
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedSupplier(supplier.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleSupplierAction(
                            supplier.id,
                            supplier.status === 'active' ? 'deactivate' : 'activate'
                          )
                        }
                      >
                        {supplier.status === 'active' ? (
                          <AlertTriangle className="h-4 w-4" />
                        ) : (
                          <CheckCircle className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleSupplierAction(supplier.id, 'delete')}
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

      {selectedSupplier && (
        <Dialog
          open={!!selectedSupplier}
          onOpenChange={() => setSelectedSupplier(null)}
        >
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Supplier Details</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="overview">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="products">Products</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>
              <TabsContent value="overview">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 mr-2" />
                          {suppliers.find(s => s.id === selectedSupplier)?.contact.phone}
                        </div>
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 mr-2" />
                          {suppliers.find(s => s.id === selectedSupplier)?.contact.email}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {suppliers.find(s => s.id === selectedSupplier)?.contact.address}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Quality Score</span>
                          <span>
                            {suppliers.find(s => s.id === selectedSupplier)?.performance.qualityScore}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Response Time</span>
                          <span>
                            {suppliers.find(s => s.id === selectedSupplier)?.performance.responseTime} hours
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="products">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Lead Time</TableHead>
                      <TableHead>Minimum Order</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suppliers
                      .find(s => s.id === selectedSupplier)
                      ?.products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>${product.price}</TableCell>
                          <TableCell>{product.leadTime} days</TableCell>
                          <TableCell>{product.minimumOrder} units</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="orders">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead>Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suppliers
                      .find(s => s.id === selectedSupplier)
                      ?.orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell>{order.id}</TableCell>
                          <TableCell>{format(new Date(order.date), 'PP')}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{order.status}</Badge>
                          </TableCell>
                          <TableCell>{order.items}</TableCell>
                          <TableCell>${order.total.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TabsContent>
              <TabsContent value="documents">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {suppliers
                      .find(s => s.id === selectedSupplier)
                      ?.documents.map((doc) => (
                        <TableRow key={doc.id}>
                          <TableCell>{doc.name}</TableCell>
                          <TableCell>{doc.type}</TableCell>
                          <TableCell>{format(new Date(doc.date), 'PP')}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{doc.status}</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
