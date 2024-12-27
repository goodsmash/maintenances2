import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  addDays,
  format,
  parse,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isWithinInterval,
  addWeeks,
  subWeeks,
  isSameDay,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
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
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';

interface Availability {
  contractorId: string;
  date: string;
  slots: {
    startTime: string;
    endTime: string;
    available: boolean;
  }[];
}

interface Appointment {
  id: string;
  serviceRequestId: string;
  contractorId: string;
  customerId: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  service: {
    name: string;
    category: string;
    estimatedDuration: string;
  };
  contractor: {
    name: string;
    phone: string;
    email: string;
  };
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  location: {
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  notes?: string;
}

const appointmentSchema = z.object({
  date: z.date({
    required_error: 'Please select a date',
  }),
  timeSlot: z.object({
    startTime: z.string(),
    endTime: z.string(),
  }),
  notes: z.string().optional(),
});

type AppointmentFormData = z.infer<typeof appointmentSchema>;

interface SchedulingSystemProps {
  contractorId: string;
  serviceRequestId: string;
  customerId: string;
  estimatedDuration: number; // in minutes
}

export function SchedulingSystem({
  contractorId,
  serviceRequestId,
  customerId,
  estimatedDuration,
}: SchedulingSystemProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [availability, setAvailability] = useState<Availability[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
  });

  useEffect(() => {
    loadAvailability();
    loadAppointments();
  }, [currentDate, contractorId]);

  const loadAvailability = async () => {
    try {
      setLoading(true);
      const start = startOfWeek(currentDate);
      const end = endOfWeek(currentDate);
      const response = await api.getContractorAvailability(contractorId, {
        startDate: format(start, 'yyyy-MM-dd'),
        endDate: format(end, 'yyyy-MM-dd'),
      });
      setAvailability(response);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load availability',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const loadAppointments = async () => {
    try {
      const response = await api.getAppointments({
        contractorId,
        customerId,
        startDate: format(startOfWeek(currentDate), 'yyyy-MM-dd'),
        endDate: format(endOfWeek(currentDate), 'yyyy-MM-dd'),
      });
      setAppointments(response);
    } catch (error) {
      console.error('Failed to load appointments:', error);
    }
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const dayAvailability = availability.find((a) =>
      isSameDay(parse(a.date, 'yyyy-MM-dd', new Date()), date)
    );
    if (dayAvailability) {
      form.setValue('date', date);
    }
  };

  const getAvailableSlots = (date: Date) => {
    const dayAvailability = availability.find((a) =>
      isSameDay(parse(a.date, 'yyyy-MM-dd', new Date()), date)
    );
    return dayAvailability?.slots.filter((slot) => slot.available) || [];
  };

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      setLoading(true);
      await api.scheduleAppointment({
        serviceRequestId,
        contractorId,
        customerId,
        date: format(data.date, 'yyyy-MM-dd'),
        startTime: data.timeSlot.startTime,
        endTime: data.timeSlot.endTime,
        notes: data.notes,
      });

      toast({
        title: 'Success',
        description: 'Appointment scheduled successfully',
      });

      loadAppointments();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to schedule appointment',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;

    try {
      setLoading(true);
      await api.cancelAppointment(appointmentId);
      toast({
        title: 'Success',
        description: 'Appointment cancelled successfully',
      });
      loadAppointments();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to cancel appointment',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Schedule Appointment</CardTitle>
          <CardDescription>
            Select a date and time for your service appointment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  onClick={() => setCurrentDate(subWeeks(currentDate, 1))}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous Week
                </Button>
                <span className="font-medium">
                  {format(startOfWeek(currentDate), 'MMM d')} -{' '}
                  {format(endOfWeek(currentDate), 'MMM d, yyyy')}
                </span>
                <Button
                  variant="ghost"
                  onClick={() => setCurrentDate(addWeeks(currentDate, 1))}
                >
                  Next Week
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {eachDayOfInterval({
                  start: startOfWeek(currentDate),
                  end: endOfWeek(currentDate),
                }).map((date) => {
                  const dayAvailability = availability.find((a) =>
                    isSameDay(parse(a.date, 'yyyy-MM-dd', new Date()), date)
                  );
                  const isAvailable = dayAvailability?.slots.some(
                    (slot) => slot.available
                  );

                  return (
                    <Button
                      key={date.toISOString()}
                      variant={
                        selectedDate && isSameDay(date, selectedDate)
                          ? 'default'
                          : 'outline'
                      }
                      className={`h-24 p-2 ${
                        !isAvailable && 'opacity-50 cursor-not-allowed'
                      }`}
                      onClick={() => isAvailable && handleDateSelect(date)}
                      disabled={!isAvailable}
                    >
                      <div className="text-center">
                        <div className="text-sm font-medium">
                          {format(date, 'EEE')}
                        </div>
                        <div className="text-2xl">{format(date, 'd')}</div>
                        {isAvailable && (
                          <div className="text-xs text-green-600 mt-1">
                            {
                              dayAvailability?.slots.filter(
                                (slot) => slot.available
                              ).length
                            }{' '}
                            slots
                          </div>
                        )}
                      </div>
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="flex-1">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="timeSlot"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Available Time Slots</FormLabel>
                        <div className="grid grid-cols-2 gap-2">
                          {selectedDate &&
                            getAvailableSlots(selectedDate).map((slot) => (
                              <Button
                                key={`${slot.startTime}-${slot.endTime}`}
                                type="button"
                                variant={
                                  field.value?.startTime === slot.startTime
                                    ? 'default'
                                    : 'outline'
                                }
                                className="h-auto py-4"
                                onClick={() =>
                                  field.onChange({
                                    startTime: slot.startTime,
                                    endTime: slot.endTime,
                                  })
                                }
                              >
                                <Clock className="h-4 w-4 mr-2" />
                                {format(
                                  parse(slot.startTime, 'HH:mm', new Date()),
                                  'h:mm a'
                                )}
                              </Button>
                            ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <textarea
                            {...field}
                            className="w-full min-h-[100px] p-2 border rounded-md"
                            placeholder="Any special instructions or notes for the contractor..."
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button type="submit" disabled={loading}>
                    {loading ? 'Scheduling...' : 'Schedule Appointment'}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Upcoming Appointments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <Card key={appointment.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {appointment.service.name}
                      </CardTitle>
                      <CardDescription>
                        {format(
                          parse(appointment.date, 'yyyy-MM-dd', new Date()),
                          'MMMM d, yyyy'
                        )}{' '}
                        at{' '}
                        {format(
                          parse(appointment.startTime, 'HH:mm', new Date()),
                          'h:mm a'
                        )}
                      </CardDescription>
                    </div>
                    <Badge
                      variant={
                        appointment.status === 'scheduled'
                          ? 'default'
                          : appointment.status === 'in_progress'
                          ? 'secondary'
                          : appointment.status === 'completed'
                          ? 'success'
                          : 'destructive'
                      }
                    >
                      {appointment.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Contractor</p>
                      <p>{appointment.contractor.name}</p>
                      <p>{appointment.contractor.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Location</p>
                      <p>{appointment.location.address}</p>
                      <p>
                        {appointment.location.city},{' '}
                        {appointment.location.state}{' '}
                        {appointment.location.zip}
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  {appointment.status === 'scheduled' && (
                    <Button
                      variant="destructive"
                      onClick={() => handleCancelAppointment(appointment.id)}
                    >
                      Cancel Appointment
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
