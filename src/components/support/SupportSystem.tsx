import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { Send, PaperclipIcon, PhoneCall } from 'lucide-react';
import { api } from '@/lib/api';

interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  assignedTo?: string;
  messages: {
    id: string;
    content: string;
    createdAt: string;
    sender: {
      id: string;
      name: string;
      role: string;
      avatar?: string;
    };
    attachments?: {
      id: string;
      filename: string;
      url: string;
      type: string;
    }[];
  }[];
}

const ticketSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(1, 'Please select a category'),
  priority: z.enum(['low', 'medium', 'high', 'urgent']),
  attachments: z.array(z.any()).optional(),
});

const messageSchema = z.object({
  content: z.string().min(1, 'Message cannot be empty'),
  attachments: z.array(z.any()).optional(),
});

type TicketFormData = z.infer<typeof ticketSchema>;
type MessageFormData = z.infer<typeof messageSchema>;

interface SupportSystemProps {
  userId: string;
}

export function SupportSystem({ userId }: SupportSystemProps) {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isNewTicketOpen, setIsNewTicketOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const ticketForm = useForm<TicketFormData>({
    resolver: zodResolver(ticketSchema),
    defaultValues: {
      subject: '',
      description: '',
      category: '',
      priority: 'medium',
      attachments: [],
    },
  });

  const messageForm = useForm<MessageFormData>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: '',
      attachments: [],
    },
  });

  useEffect(() => {
    loadTickets();
  }, [userId]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedTicket?.messages]);

  const loadTickets = async () => {
    try {
      setLoading(true);
      const response = await api.getSupportTickets(userId);
      setTickets(response);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load support tickets',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const onSubmitTicket = async (data: TicketFormData) => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'attachments') {
          Array.from(value as FileList).forEach((file) => {
            formData.append('attachments', file);
          });
        } else {
          formData.append(key, value as string);
        }
      });

      await api.createSupportTicket(formData);
      toast({
        title: 'Success',
        description: 'Support ticket created successfully',
      });
      setIsNewTicketOpen(false);
      loadTickets();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create support ticket',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmitMessage = async (data: MessageFormData) => {
    if (!selectedTicket) return;

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('content', data.content);
      formData.append('ticketId', selectedTicket.id);
      Array.from(data.attachments as FileList).forEach((file) => {
        formData.append('attachments', file);
      });

      await api.addTicketMessage(formData);
      messageForm.reset();
      loadTickets();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestCall = async () => {
    if (!selectedTicket) return;

    try {
      await api.requestSupportCall(selectedTicket.id);
      toast({
        title: 'Success',
        description: 'Support call requested. We will call you shortly.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to request support call',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Support</h2>
        <Dialog open={isNewTicketOpen} onOpenChange={setIsNewTicketOpen}>
          <DialogTrigger asChild>
            <Button>New Support Ticket</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Support Ticket</DialogTitle>
              <DialogDescription>
                Describe your issue and we'll help you resolve it
              </DialogDescription>
            </DialogHeader>
            <Form {...ticketForm}>
              <form
                onSubmit={ticketForm.handleSubmit(onSubmitTicket)}
                className="space-y-6"
              >
                <FormField
                  control={ticketForm.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={ticketForm.control}
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
                          <SelectItem value="technical">Technical Issue</SelectItem>
                          <SelectItem value="billing">Billing</SelectItem>
                          <SelectItem value="service">Service Quality</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={ticketForm.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select priority" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="urgent">Urgent</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={ticketForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          className="min-h-[200px]"
                          placeholder="Please describe your issue in detail..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={ticketForm.control}
                  name="attachments"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Attachments</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          multiple
                          onChange={(e) =>
                            field.onChange(e.target.files)
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Upload any relevant files or screenshots
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Creating...' : 'Create Ticket'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-1 space-y-4">
          {tickets.map((ticket) => (
            <Card
              key={ticket.id}
              className={`cursor-pointer transition-colors ${
                selectedTicket?.id === ticket.id
                  ? 'border-primary'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => setSelectedTicket(ticket)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-base">{ticket.subject}</CardTitle>
                    <CardDescription>
                      {format(new Date(ticket.createdAt), 'PPp')}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      ticket.status === 'open'
                        ? 'default'
                        : ticket.status === 'in_progress'
                        ? 'secondary'
                        : ticket.status === 'resolved'
                        ? 'success'
                        : 'destructive'
                    }
                  >
                    {ticket.status}
                  </Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>

        <div className="col-span-2">
          {selectedTicket ? (
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{selectedTicket.subject}</CardTitle>
                    <CardDescription>
                      Ticket #{selectedTicket.id}
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRequestCall}
                  >
                    <PhoneCall className="h-4 w-4 mr-2" />
                    Request Call
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg">
                    <p className="font-medium">Description</p>
                    <p className="mt-2">{selectedTicket.description}</p>
                  </div>

                  <div className="space-y-4 max-h-[400px] overflow-y-auto">
                    {selectedTicket.messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender.role === 'user'
                            ? 'justify-end'
                            : 'justify-start'
                        }`}
                      >
                        <div
                          className={`max-w-[80%] ${
                            message.sender.role === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          } p-4 rounded-lg`}
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            {message.sender.avatar ? (
                              <img
                                src={message.sender.avatar}
                                alt={message.sender.name}
                                className="h-6 w-6 rounded-full"
                              />
                            ) : (
                              <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-xs font-medium">
                                  {message.sender.name[0]}
                                </span>
                              </div>
                            )}
                            <span className="font-medium">
                              {message.sender.name}
                            </span>
                            <span className="text-xs">
                              {format(
                                new Date(message.createdAt),
                                'MMM d, h:mm a'
                              )}
                            </span>
                          </div>
                          <p>{message.content}</p>
                          {message.attachments && message.attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {message.attachments.map((attachment) => (
                                <a
                                  key={attachment.id}
                                  href={attachment.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center text-sm hover:underline"
                                >
                                  <PaperclipIcon className="h-4 w-4 mr-1" />
                                  {attachment.filename}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Form {...messageForm}>
                  <form
                    onSubmit={messageForm.handleSubmit(onSubmitMessage)}
                    className="w-full space-y-4"
                  >
                    <FormField
                      control={messageForm.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <div className="flex space-x-2">
                              <Textarea
                                {...field}
                                placeholder="Type your message..."
                                className="flex-1"
                              />
                              <Button
                                type="submit"
                                size="icon"
                                disabled={loading}
                              >
                                <Send className="h-4 w-4" />
                              </Button>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={messageForm.control}
                      name="attachments"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              type="file"
                              multiple
                              onChange={(e) =>
                                field.onChange(e.target.files)
                              }
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </form>
                </Form>
              </CardFooter>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-[600px] text-gray-500">
                Select a ticket to view details
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
