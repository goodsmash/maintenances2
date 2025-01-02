import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { timeSlots, getAvailableTimeSlots, createAppointment } from '@/data/appointmentsData';
import { format } from 'date-fns';
import { useToast } from '@/components/ui/use-toast';

interface AppointmentSchedulerProps {
  serviceType: string;
  serviceId: string;
  serviceName: string;
  onScheduled?: () => void;
}

export const AppointmentScheduler: React.FC<AppointmentSchedulerProps> = ({
  serviceType,
  serviceId,
  serviceName,
  onScheduled
}) => {
  const { user } = useAuth0();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (selectedDate) {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const slots = await getAvailableTimeSlots(formattedDate, serviceType);
        setAvailableTimeSlots(slots);
      }
    };

    fetchAvailableSlots();
  }, [selectedDate, serviceType]);

  const handleSchedule = async () => {
    if (!selectedDate || !selectedTime || !user) {
      toast({
        title: 'Error',
        description: 'Please select a date and time for your appointment',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const appointment = await createAppointment({
        serviceType,
        serviceId,
        customerId: user.sub!,
        customerName: user.name || '',
        customerEmail: user.email || '',
        customerPhone: '', // This should be collected separately
        address: '', // This should be collected separately
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        status: 'pending',
        notes: `Appointment for ${serviceName}`
      });

      toast({
        title: 'Appointment Scheduled',
        description: `Your appointment has been scheduled for ${format(selectedDate, 'MMMM do, yyyy')} at ${selectedTime}`,
      });

      onScheduled?.();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to schedule appointment. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule Appointment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Date</label>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            disabled={(date) => date < new Date() || date.getDay() === 0}
            className="rounded-md border"
          />
        </div>

        {selectedDate && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Time</label>
            <Select onValueChange={setSelectedTime} value={selectedTime}>
              <SelectTrigger>
                <SelectValue placeholder="Select time" />
              </SelectTrigger>
              <SelectContent>
                {availableTimeSlots.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Button
          onClick={handleSchedule}
          disabled={!selectedDate || !selectedTime || isLoading}
          className="w-full"
        >
          {isLoading ? 'Scheduling...' : 'Schedule Appointment'}
        </Button>
      </CardContent>
    </Card>
  );
};
