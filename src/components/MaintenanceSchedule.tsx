import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { MaintenanceSchedule, PriorityLevel } from '@/types';
import { api } from '@/lib/api';
import { Loader2, Calendar as CalendarIcon, CheckCircle2, AlertCircle } from 'lucide-react';

const frequencies = [
  'weekly',
  'bi-weekly',
  'monthly',
  'quarterly',
  'semi-annually',
  'annually',
] as const;

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  frequency: z.enum(frequencies),
  nextDueDate: z.date(),
  tasks: z.array(z.object({
    task: z.string(),
    category: z.string(),
    priority: z.enum(['low', 'medium', 'high', 'emergency'] as const),
  })).min(1, 'At least one task is required'),
});

type FormData = z.infer<typeof formSchema>;

interface MaintenanceScheduleListProps {
  userId?: string;
}

export function MaintenanceScheduleList({ userId }: MaintenanceScheduleListProps) {
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      frequency: 'monthly',
      tasks: [{ task: '', category: '', priority: 'medium' }],
    },
  });

  useState(() => {
    async function loadSchedules() {
      try {
        const data = await api.getMaintenanceSchedules(userId);
        setSchedules(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load schedules'));
      } finally {
        setLoading(false);
      }
    }
    loadSchedules();
  }, [userId]);

  const onSubmit = async (data: FormData) => {
    try {
      const newSchedule = await api.createMaintenanceSchedule(data);
      setSchedules(prev => [...prev, newSchedule]);
      setIsCreateDialogOpen(false);
      toast({
        title: 'Schedule Created',
        description: 'Your maintenance schedule has been created successfully.',
      });
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create maintenance schedule. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const addTask = () => {
    const currentTasks = form.getValues('tasks');
    form.setValue('tasks', [
      ...currentTasks,
      { task: '', category: '', priority: 'medium' },
    ]);
  };

  const removeTask = (index: number) => {
    const currentTasks = form.getValues('tasks');
    form.setValue('tasks', currentTasks.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500">
        Error loading maintenance schedules: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Maintenance Schedules</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Create Schedule</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Maintenance Schedule</DialogTitle>
              <DialogDescription>
                Set up a recurring maintenance schedule for your property
              </DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Schedule Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Monthly Home Maintenance" {...field} />
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
                      <FormLabel>Description (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Brief description of the maintenance schedule" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="frequency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Frequency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {frequencies.map((freq) => (
                            <SelectItem key={freq} value={freq}>
                              {freq.charAt(0).toUpperCase() + freq.slice(1)}
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
                  name="nextDueDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Next Due Date</FormLabel>
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) => date < new Date()}
                        initialFocus
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <FormLabel>Tasks</FormLabel>
                    <Button type="button" variant="outline" onClick={addTask}>
                      Add Task
                    </Button>
                  </div>

                  {form.getValues('tasks').map((_, index) => (
                    <div key={index} className="flex gap-4">
                      <FormField
                        control={form.control}
                        name={`tasks.${index}.task`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="Task description" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`tasks.${index}.category`}
                        render={({ field }) => (
                          <FormItem className="w-32">
                            <FormControl>
                              <Input placeholder="Category" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`tasks.${index}.priority`}
                        render={({ field }) => (
                          <FormItem className="w-32">
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Priority" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="low">Low</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="emergency">Emergency</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => removeTask(index)}
                        disabled={form.getValues('tasks').length === 1}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Schedule</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {schedules.map((schedule) => (
          <Card key={schedule.id}>
            <CardHeader>
              <CardTitle>{schedule.name}</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{schedule.frequency.charAt(0).toUpperCase() + schedule.frequency.slice(1)}</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {schedule.description && (
                  <p className="text-sm text-gray-500">{schedule.description}</p>
                )}

                <div>
                  <h4 className="font-semibold mb-2">Next Due</h4>
                  <div className="flex items-center gap-2">
                    {new Date(schedule.nextDueDate) < new Date() ? (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                    <span>{new Date(schedule.nextDueDate).toLocaleDateString()}</span>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Tasks</h4>
                  <div className="space-y-2">
                    {schedule.tasks.map((task, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm">{task.task}</span>
                        <Badge
                          variant={
                            task.priority === 'high' || task.priority === 'emergency'
                              ? 'destructive'
                              : task.priority === 'medium'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {task.priority}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {schedule.lastCompleted && (
                  <div className="text-sm text-gray-500">
                    Last completed: {new Date(schedule.lastCompleted).toLocaleDateString()}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
