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
  Package,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Search,
  Filter,
  Download,
  Upload,
  BarChart2,
  Settings,
  Plus,
  Edit,
  Trash2,
  RefreshCw,
  Printer,
  FileText,
} from 'lucide-react';
import { format } from 'date-fns';
import { inventoryApi } from '@/lib/api/inventory';
import { InventoryItem, InventoryAlert } from '@/types/inventory';
import { DataTable } from '@/components/ui/data-table';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Progress } from '@/components/ui/progress';

const itemSchema = z.object({
  name: z.string().min(1, 'Item name is required'),
  sku: z.string().min(1, 'SKU is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string(),
  quantity: z.number().min(0, 'Quantity must be positive'),
  unit: z.string(),
  minQuantity: z.number().min(0),
  maxQuantity: z.number().min(0),
  reorderPoint: z.number().min(0),
  cost: z.number().min(0),
  price: z.number().min(0),
  supplier: z.object({
    id: z.string(),
    name: z.string(),
    leadTime: z.number(),
  }),
  location: z.object({
    warehouse: z.string(),
    zone: z.string(),
    shelf: z.string(),
    bin: z.string(),
  }),
});

export function InventoryManagement() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [alerts, setAlerts] = useState<InventoryAlert[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    search: '',
  });
  const { toast } = useToast();

  const form = useForm<z.infer<typeof itemSchema>>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      quantity: 0,
      minQuantity: 0,
      maxQuantity: 0,
      reorderPoint: 0,
      cost: 0,
      price: 0,
    },
  });

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [itemsData, alertsData] = await Promise.all([
        inventoryApi.getItems(filters),
        inventoryApi.getAlerts(),
      ]);
      setItems(itemsData);
      setAlerts(alertsData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load inventory data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof itemSchema>) => {
    try {
      await inventoryApi.createItem(data);
      setIsCreateOpen(false);
      loadData();
      toast({
        title: 'Success',
        description: 'Item created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create item',
        variant: 'destructive',
      });
    }
  };

  const handleItemAction = async (
    itemId: string,
    action: 'edit' | 'delete'
  ) => {
    try {
      if (action === 'delete') {
        await inventoryApi.deleteItem(itemId);
        loadData();
        toast({
          title: 'Success',
          description: 'Item deleted successfully',
        });
      } else {
        setSelectedItem(itemId);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} item`,
        variant: 'destructive',
      });
    }
  };

  const exportInventory = async () => {
    try {
      const report = await inventoryApi.generateReport({
        type: 'stock_level',
        dateRange: {
          start: new Date().toISOString(),
          end: new Date().toISOString(),
        },
        format: 'excel',
      });
      
      const url = window.URL.createObjectURL(new Blob([report]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `inventory-report-${format(new Date(), 'yyyy-MM-dd')}.xlsx`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to export inventory report',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Inventory Management</h2>
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={exportInventory}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Add Inventory Item</DialogTitle>
                <DialogDescription>
                  Create a new inventory item
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
                          <FormLabel>Item Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>SKU</FormLabel>
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
                              <SelectItem value="tools">Tools</SelectItem>
                              <SelectItem value="parts">Parts</SelectItem>
                              <SelectItem value="supplies">
                                Supplies
                              </SelectItem>
                              <SelectItem value="equipment">
                                Equipment
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="0"
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

                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="cost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="0"
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

                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Price</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="0"
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

                    <FormField
                      control={form.control}
                      name="reorderPoint"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reorder Point</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="number"
                              min="0"
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

                  <DialogFooter>
                    <Button type="submit">Create Item</Button>
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
              Total Items
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {new Set(items.map((i) => i.category)).size} categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Low Stock Items
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {items.filter((i) => i.status === 'low_stock').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Requires attention
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Value
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${items
                .reduce((acc, item) => acc + item.price * item.quantity, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Current inventory value
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Stock Health
            </CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(
                (items.filter((i) => i.status === 'in_stock').length /
                  items.length) *
                100
              ).toFixed(1)}
              %
            </div>
            <Progress
              value={
                (items.filter((i) => i.status === 'in_stock').length /
                  items.length) *
                100
              }
              className="mt-2"
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventory Items</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search items..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="max-w-sm"
              />
            </div>
            <Select
              value={filters.category}
              onValueChange={(value) =>
                setFilters({ ...filters, category: value })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="tools">Tools</SelectItem>
                <SelectItem value="parts">Parts</SelectItem>
                <SelectItem value="supplies">Supplies</SelectItem>
                <SelectItem value="equipment">Equipment</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filters.status}
              onValueChange={(value) =>
                setFilters({ ...filters, status: value })
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="in_stock">In Stock</SelectItem>
                <SelectItem value="low_stock">Low Stock</SelectItem>
                <SelectItem value="out_of_stock">Out of Stock</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-500">
                        {item.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{item.sku}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{item.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {item.quantity} {item.unit}
                      </div>
                      <div className="text-sm text-gray-500">
                        Min: {item.minQuantity} | Max: {item.maxQuantity}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        item.status === 'in_stock'
                          ? 'default'
                          : item.status === 'low_stock'
                          ? 'warning'
                          : 'destructive'
                      }
                    >
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {item.location.warehouse} - {item.location.zone}
                      <br />
                      {item.location.shelf}/{item.location.bin}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleItemAction(item.id, 'edit')}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleItemAction(item.id, 'delete')}
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
            <CardTitle>Alerts</CardTitle>
            <CardDescription>
              Recent inventory alerts and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    {alert.type === 'low_stock' ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    ) : alert.type === 'expiring' ? (
                      <Clock className="h-5 w-5 text-red-500" />
                    ) : (
                      <Bell className="h-5 w-5 text-blue-500" />
                    )}
                    <div>
                      <div className="font-medium">{alert.message}</div>
                      <div className="text-sm text-gray-500">
                        {format(new Date(alert.date), 'PP')}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={
                      alert.severity === 'high'
                        ? 'destructive'
                        : alert.severity === 'medium'
                        ? 'warning'
                        : 'default'
                    }
                  >
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common inventory management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="h-24 flex flex-col">
                <RefreshCw className="h-6 w-6 mb-2" />
                Start Stock Count
              </Button>
              <Button variant="outline" className="h-24 flex flex-col">
                <Upload className="h-6 w-6 mb-2" />
                Receive Items
              </Button>
              <Button variant="outline" className="h-24 flex flex-col">
                <Printer className="h-6 w-6 mb-2" />
                Print Labels
              </Button>
              <Button variant="outline" className="h-24 flex flex-col">
                <FileText className="h-6 w-6 mb-2" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
