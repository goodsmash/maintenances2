import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft } from 'lucide-react';
import { AppointmentScheduler } from '@/components/AppointmentScheduler';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth0 } from '@auth0/auth0-react';
import { serviceCategories } from '@/data/serviceCategories';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { createAppointment } from '@/data/appointmentsData';
import { useToast } from '@/components/ui/use-toast';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  address: z.string().min(5, 'Please enter your full address'),
  description: z.string().min(10, 'Please provide more details about your request'),
  serviceCategory: z.string(),
  serviceType: z.string(),
  urgencyLevel: z.string(),
  preferredDate: z.string(),
  preferredTime: z.string(),
});

const ServiceRequestForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, loginWithRedirect } = useAuth0();
  const searchParams = new URLSearchParams(location.search);
  const categoryFromUrl = searchParams.get('category');

  const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl || '');
  const [selectedService, setSelectedService] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      address: '',
      description: '',
      serviceCategory: categoryFromUrl || '',
      serviceType: '',
      urgencyLevel: 'routine',
      preferredDate: '',
      preferredTime: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const selectedCategoryData = serviceCategories.find(cat => cat.id === values.serviceCategory);
      const selectedServiceData = selectedCategoryData?.services.find(service => service.id === values.serviceType);

      if (!selectedCategoryData || !selectedServiceData) {
        throw new Error('Invalid service selection');
      }

      const appointment = await createAppointment({
        serviceType: values.serviceCategory,
        serviceId: values.serviceType,
        customerId: user?.sub || '',
        customerName: values.name,
        customerEmail: values.email,
        customerPhone: values.phone,
        address: values.address,
        date: values.preferredDate,
        time: values.preferredTime,
        status: 'pending',
        notes: values.description,
        urgencyLevel: values.urgencyLevel,
        estimatedDuration: selectedServiceData.estimatedDuration,
        price: selectedServiceData.priceRange.min,
      });

      toast({
        title: "Service Request Submitted",
        description: "We'll contact you shortly to confirm your appointment.",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "There was a problem submitting your request. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Sign In Required</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Please sign in to request services or schedule appointments.</p>
            <Button onClick={() => loginWithRedirect()}>Sign In</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const availableServices = serviceCategories.find(cat => cat.id === selectedCategory)?.services || [];

  return (
    <div className="container mx-auto px-4 py-12">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-primary hover:text-primary/80 mb-8"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back
      </button>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Request Service</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="details">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Service Details</TabsTrigger>
              <TabsTrigger value="schedule">Schedule Appointment</TabsTrigger>
            </TabsList>

            <TabsContent value="details">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="serviceCategory"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Category</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setSelectedCategory(value);
                            setSelectedService('');
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a service category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {serviceCategories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
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
                    name="serviceType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!selectedCategory}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a service type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {availableServices.map((service) => (
                              <SelectItem key={service.id} value={service.id}>
                                {service.name}
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
                    name="urgencyLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Urgency Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select urgency level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="routine">Routine</SelectItem>
                            <SelectItem value="priority">Priority</SelectItem>
                            <SelectItem value="urgent">Urgent</SelectItem>
                            <SelectItem value="emergency">Emergency</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
                          <Input {...field} type="email" />
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
                          <Input {...field} type="tel" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Address</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="Please describe your service request in detail"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </TabsContent>

            <TabsContent value="schedule">
              <AppointmentScheduler
                onSchedule={(date, time) => {
                  form.setValue('preferredDate', date);
                  form.setValue('preferredTime', time);
                }}
                serviceType={selectedCategory}
              />
              <div className="mt-6">
                <Button 
                  onClick={form.handleSubmit(onSubmit)}
                  className="w-full"
                >
                  Submit Request
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceRequestForm;
