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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Mail,
  MessageSquare,
  Bell,
  Calendar,
  Users,
  Target,
  BarChart,
  Settings,
  Send,
  Edit,
  Trash2,
  Play,
  Pause,
  Copy,
} from 'lucide-react';
import { format } from 'date-fns';
import { api } from '@/lib/api';

interface Campaign {
  id: string;
  name: string;
  type: 'email' | 'sms' | 'push' | 'whatsapp';
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  audience: {
    type: string;
    criteria: Record<string, any>;
    size: number;
  };
  content: {
    subject?: string;
    body: string;
    template?: string;
    variables?: string[];
  };
  schedule: {
    startDate?: string;
    endDate?: string;
    frequency?: string;
    timezone: string;
  };
  metrics: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    converted: number;
    unsubscribed: number;
  };
  lastModified: string;
  createdBy: string;
}

interface Template {
  id: string;
  name: string;
  type: string;
  category: string;
  content: string;
  variables: string[];
  thumbnail?: string;
  usage: number;
}

interface AutomationRule {
  id: string;
  name: string;
  trigger: {
    type: string;
    conditions: Record<string, any>[];
  };
  actions: {
    type: string;
    parameters: Record<string, any>;
  }[];
  status: 'active' | 'paused';
  metrics: {
    triggered: number;
    completed: number;
    failed: number;
  };
}

const campaignSchema = z.object({
  name: z.string().min(1, 'Campaign name is required'),
  type: z.enum(['email', 'sms', 'push', 'whatsapp']),
  audience: z.object({
    type: z.string(),
    criteria: z.record(z.any()),
  }),
  content: z.object({
    subject: z.string().optional(),
    body: z.string(),
    template: z.string().optional(),
    variables: z.array(z.string()).optional(),
  }),
  schedule: z.object({
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    frequency: z.string().optional(),
    timezone: z.string(),
  }),
});

export function MarketingAutomation() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [rules, setRules] = useState<AutomationRule[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<string>('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof campaignSchema>>({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      type: 'email',
      audience: {
        type: 'all',
        criteria: {},
      },
      content: {
        body: '',
      },
      schedule: {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [campaignsData, templatesData, rulesData] = await Promise.all([
        api.getCampaigns(),
        api.getTemplates(),
        api.getAutomationRules(),
      ]);
      setCampaigns(campaignsData);
      setTemplates(templatesData);
      setRules(rulesData);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load marketing data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: z.infer<typeof campaignSchema>) => {
    try {
      await api.createCampaign(data);
      setIsCreateOpen(false);
      loadData();
      toast({
        title: 'Success',
        description: 'Campaign created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create campaign',
        variant: 'destructive',
      });
    }
  };

  const handleCampaignAction = async (
    campaignId: string,
    action: 'start' | 'pause' | 'delete'
  ) => {
    try {
      await api.updateCampaign(campaignId, action);
      loadData();
      toast({
        title: 'Success',
        description: `Campaign ${action}ed successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${action} campaign`,
        variant: 'destructive',
      });
    }
  };

  const duplicateCampaign = async (campaignId: string) => {
    try {
      await api.duplicateCampaign(campaignId);
      loadData();
      toast({
        title: 'Success',
        description: 'Campaign duplicated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to duplicate campaign',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Marketing Automation</h2>
        <div className="flex items-center space-x-4">
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Mail className="h-4 w-4 mr-2" />
                Create Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Campaign</DialogTitle>
                <DialogDescription>
                  Create a new marketing campaign
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campaign Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campaign Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="sms">SMS</SelectItem>
                            <SelectItem value="push">
                              Push Notification
                            </SelectItem>
                            <SelectItem value="whatsapp">
                              WhatsApp
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="audience.type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Audience</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select audience" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">
                              All Customers
                            </SelectItem>
                            <SelectItem value="segment">
                              Customer Segment
                            </SelectItem>
                            <SelectItem value="custom">
                              Custom Filter
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content.template"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Template</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select template" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {templates.map((template) => (
                              <SelectItem
                                key={template.id}
                                value={template.id}
                              >
                                {template.name}
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
                    name="content.body"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            rows={6}
                            placeholder="Enter campaign content..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="submit">Create Campaign</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Campaign List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Campaigns</CardTitle>
          <CardDescription>
            Manage your marketing campaigns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.map((campaign) => (
                <TableRow key={campaign.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{campaign.name}</div>
                      <div className="text-sm text-gray-500">
                        by {campaign.createdBy}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{campaign.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        campaign.status === 'active'
                          ? 'default'
                          : campaign.status === 'paused'
                          ? 'secondary'
                          : campaign.status === 'completed'
                          ? 'success'
                          : 'outline'
                      }
                    >
                      {campaign.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {campaign.audience.type}
                      </div>
                      <div className="text-sm text-gray-500">
                        {campaign.audience.size.toLocaleString()} recipients
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        {campaign.metrics.opened} opens (
                        {(
                          (campaign.metrics.opened /
                            campaign.metrics.delivered) *
                          100
                        ).toFixed(1)}
                        %)
                      </div>
                      <div className="text-sm">
                        {campaign.metrics.clicked} clicks (
                        {(
                          (campaign.metrics.clicked /
                            campaign.metrics.delivered) *
                          100
                        ).toFixed(1)}
                        %)
                      </div>
                      <Progress
                        value={
                          (campaign.metrics.converted /
                            campaign.metrics.delivered) *
                          100
                        }
                        className="h-2"
                      />
                    </div>
                  </TableCell>
                  <TableCell>
                    {format(new Date(campaign.lastModified), 'PP')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {campaign.status === 'active' ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleCampaignAction(campaign.id, 'pause')
                          }
                        >
                          <Pause className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() =>
                            handleCampaignAction(campaign.id, 'start')
                          }
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          duplicateCampaign(campaign.id)
                        }
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleCampaignAction(campaign.id, 'delete')
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

      {/* Automation Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Automation Rules</CardTitle>
          <CardDescription>
            Manage automated marketing workflows
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {rules.map((rule) => (
              <div
                key={rule.id}
                className="border rounded-lg p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-medium">{rule.name}</h3>
                    <p className="text-sm text-gray-500">
                      Trigger: {rule.trigger.type}
                    </p>
                  </div>
                  <Switch
                    checked={rule.status === 'active'}
                    onCheckedChange={(checked) =>
                      api.updateRule(rule.id, {
                        status: checked ? 'active' : 'paused',
                      })
                    }
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Conditions
                    </h4>
                    <div className="space-y-2">
                      {rule.trigger.conditions.map(
                        (condition, index) => (
                          <div
                            key={index}
                            className="text-sm text-gray-600"
                          >
                            {JSON.stringify(condition)}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium mb-2">
                      Actions
                    </h4>
                    <div className="space-y-2">
                      {rule.actions.map((action, index) => (
                        <div
                          key={index}
                          className="text-sm text-gray-600"
                        >
                          {action.type}:{' '}
                          {JSON.stringify(action.parameters)}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm font-medium">
                      Triggered
                    </div>
                    <div className="text-2xl font-bold">
                      {rule.metrics.triggered.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">
                      Completed
                    </div>
                    <div className="text-2xl font-bold">
                      {rule.metrics.completed.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Failed</div>
                    <div className="text-2xl font-bold">
                      {rule.metrics.failed.toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Email Templates</CardTitle>
          <CardDescription>
            Manage your email templates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-3">
            {templates.map((template) => (
              <Card key={template.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    {template.name}
                  </CardTitle>
                  <CardDescription>
                    {template.category}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {template.thumbnail && (
                    <img
                      src={template.thumbnail}
                      alt={template.name}
                      className="w-full h-32 object-cover rounded-md mb-4"
                    />
                  )}
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">
                      {template.type}
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Used {template.usage} times
                    </span>
                  </div>
                  <div className="mt-4 flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
