import React, { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Appointment } from '@/data/appointmentsData';
import { Clock, MapPin, Calendar as CalendarIcon } from 'lucide-react';

const AppointmentCard: React.FC<{ appointment: Appointment }> = ({ appointment }) => (
  <Card>
    <CardHeader className="pb-3">
      <CardTitle>{appointment.serviceName}</CardTitle>
      <CardDescription>
        <Badge
          variant={
            appointment.status === 'confirmed'
              ? 'default'
              : appointment.status === 'completed'
              ? 'secondary'
              : appointment.status === 'cancelled'
              ? 'destructive'
              : 'outline'
          }
        >
          {appointment.status}
        </Badge>
      </CardDescription>
    </CardHeader>
    <CardContent className="space-y-2">
      <div className="flex items-center text-sm text-muted-foreground">
        <CalendarIcon className="mr-2 h-4 w-4" />
        {format(new Date(appointment.date), 'MMMM d, yyyy')}
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <Clock className="mr-2 h-4 w-4" />
        {appointment.time}
      </div>
      <div className="flex items-center text-sm text-muted-foreground">
        <MapPin className="mr-2 h-4 w-4" />
        {appointment.address}
      </div>
    </CardContent>
  </Card>
);

const Dashboard = () => {
  const { user } = useAuth0();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  useEffect(() => {
    // TODO: Fetch appointments from backend
    // For now, using mock data
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        serviceType: 'contractor',
        serviceId: 'renovation',
        customerId: user?.sub || '',
        customerName: user?.name || '',
        customerEmail: user?.email || '',
        customerPhone: '555-0123',
        address: '123 Main St, City, State',
        date: '2025-01-05',
        time: '10:00',
        status: 'confirmed',
        notes: 'Kitchen renovation consultation',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        serviceType: 'appliance',
        serviceId: 'repair',
        customerId: user?.sub || '',
        customerName: user?.name || '',
        customerEmail: user?.email || '',
        customerPhone: '555-0124',
        address: '456 Oak St, City, State',
        date: '2025-01-10',
        time: '14:30',
        status: 'pending',
        notes: 'Refrigerator repair',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    setAppointments(mockAppointments);
  }, [user]);

  const upcomingAppointments = appointments.filter(
    app => new Date(app.date) >= new Date()
  );

  const pastAppointments = appointments.filter(
    app => new Date(app.date) < new Date()
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Welcome back, {user?.name}!</CardTitle>
            <CardDescription>
              Manage your maintenance services and appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <a href="/service/contractor">Schedule New Service</a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Calendar</CardTitle>
            <CardDescription>View your scheduled appointments</CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Your service history</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span>Upcoming Appointments</span>
              <span>{upcomingAppointments.length}</span>
            </div>
            <div className="flex justify-between">
              <span>Past Services</span>
              <span>{pastAppointments.length}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Tabs defaultValue="upcoming" className="space-y-4">
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
            <TabsTrigger value="past">Past Appointments</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {upcomingAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
              {upcomingAppointments.length === 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>No Upcoming Appointments</CardTitle>
                    <CardDescription>
                      Schedule a new service to get started
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild>
                      <a href="/service/contractor">Schedule Service</a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="past">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pastAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} />
              ))}
              {pastAppointments.length === 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>No Past Appointments</CardTitle>
                    <CardDescription>
                      Your service history will appear here
                    </CardDescription>
                  </CardHeader>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
