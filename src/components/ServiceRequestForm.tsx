import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { ServiceRequest, PriorityLevel } from '@/types';
import { useServiceRequests } from '@/hooks/useServiceRequests';

const serviceTypes = [
  'plumbing',
  'electrical',
  'hvac',
  'carpentry',
  'painting',
  'general_maintenance',
] as const;

const priorityLevels: PriorityLevel[] = ['low', 'medium', 'high', 'emergency'];

const timeSlots = [
  '09:00-12:00',
  '12:00-15:00',
  '15:00-18:00',
] as const;

const formSchema = z.object({
  serviceType: z.enum(serviceTypes),
  priority: z.enum(priorityLevels),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  location: z.object({
    address: z.string().min(1, 'Address is required'),
    unit: z.string().optional(),
    accessInstructions: z.string().optional(),
  }),
  preferredSchedule: z.object({
    date: z.date(),
    timeSlots: z.array(z.enum(timeSlots)).min(1, 'Please select at least one time slot'),
  }),
});

type FormData = z.infer<typeof formSchema>;

export function ServiceRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createRequest } = useServiceRequests();
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      priority: 'medium',
      preferredSchedule: {
        timeSlots: [],
      },
    },
  });

  const onSubmit = async (data: FormData) => {
    try {
      setIsSubmitting(true);
      await createRequest({
        ...data,
        status: 'pending',
      });
      
      toast({
        title: 'Success',
        description: 'Your service request has been submitted.',
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit service request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="serviceType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Service Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type.replace('_', ' ').toUpperCase()}
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
          name="priority"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Priority Level</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {priorityLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level.toUpperCase()}
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the issue in detail..."
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Please provide as much detail as possible about the maintenance issue.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location.address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="Enter your address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location.unit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Unit (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="Apartment or unit number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="location.accessInstructions"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Access Instructions (Optional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Any special instructions for accessing the property..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preferredSchedule.date"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Preferred Date</FormLabel>
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) => date < new Date() || date > new Date().setMonth(new Date().getMonth() + 2)}
                initialFocus
              />
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="preferredSchedule.timeSlots"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Preferred Time Slots</FormLabel>
              <div className="flex gap-4">
                {timeSlots.map((slot) => (
                  <Button
                    key={slot}
                    type="button"
                    variant={field.value?.includes(slot) ? 'default' : 'outline'}
                    onClick={() => {
                      const updatedSlots = field.value?.includes(slot)
                        ? field.value.filter((s) => s !== slot)
                        : [...(field.value || []), slot];
                      field.onChange(updatedSlots);
                    }}
                  >
                    {slot}
                  </Button>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </Button>
      </form>
    </Form>
  );
}
