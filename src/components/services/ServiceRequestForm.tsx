import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Clock, Upload } from 'lucide-react';
import { serviceCategories, Service, ServiceCategory, UrgencyLevel } from '@/data/serviceCategories';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'application/pdf',
];

const serviceRequestSchema = z.object({
  categoryId: z.string().min(1, 'Please select a category'),
  serviceId: z.string().min(1, 'Please select a service'),
  urgencyLevel: z.string().min(1, 'Please select urgency level'),
  preferredDate: z.date({
    required_error: 'Please select a preferred date',
  }),
  preferredTime: z.string().min(1, 'Please select a preferred time'),
  description: z.string().min(10, 'Please provide more details about the issue'),
  address: z.object({
    street: z.string().min(1, 'Street address is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    zip: z.string().min(5, 'Valid ZIP code is required'),
  }),
  attachments: z
    .array(
      z.object({
        file: z.instanceof(File),
        preview: z.string(),
      })
    )
    .optional(),
  additionalNotes: z.string().optional(),
});

type ServiceRequestFormData = z.infer<typeof serviceRequestSchema>;

export function ServiceRequestForm() {
  const router = useRouter();
  const { categoryId, serviceId, urgency } = router.query;
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory | null>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [uploading, setUploading] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState<{
    min: number;
    max: number;
  } | null>(null);

  const form = useForm<ServiceRequestFormData>({
    resolver: zodResolver(serviceRequestSchema),
    defaultValues: {
      categoryId: categoryId as string || '',
      serviceId: serviceId as string || '',
      urgencyLevel: urgency as string || '',
      description: '',
      address: {
        street: '',
        city: '',
        state: '',
        zip: '',
      },
      attachments: [],
      additionalNotes: '',
    },
  });

  // Load initial category and service
  useEffect(() => {
    if (categoryId) {
      const category = serviceCategories.find((c) => c.id === categoryId);
      if (category) {
        setSelectedCategory(category);
        form.setValue('categoryId', category.id);

        if (serviceId) {
          const service = category.services.find((s) => s.id === serviceId);
          if (service) {
            setSelectedService(service);
            form.setValue('serviceId', service.id);
            updateEstimatedCost(service, urgency as string);
          }
        }
      }
    }
  }, [categoryId, serviceId, urgency]);

  // Update estimated cost when service or urgency changes
  const updateEstimatedCost = (
    service: Service,
    urgencyLevel: string | undefined
  ) => {
    if (!service) return;

    const urgencyMultiplier =
      service.urgencyLevels.find((level) => level.id === urgencyLevel)
        ?.priceMultiplier || 1;

    setEstimatedCost({
      min: service.priceRange.min * urgencyMultiplier,
      max: service.priceRange.max * urgencyMultiplier,
    });
  };

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    const category = serviceCategories.find((c) => c.id === categoryId);
    setSelectedCategory(category || null);
    setSelectedService(null);
    form.setValue('serviceId', '');
    setEstimatedCost(null);
  };

  // Handle service change
  const handleServiceChange = (serviceId: string) => {
    if (!selectedCategory) return;

    const service = selectedCategory.services.find((s) => s.id === serviceId);
    setSelectedService(service || null);
    if (service) {
      updateEstimatedCost(service, form.getValues('urgencyLevel'));
    }
  };

  // Handle file upload
  const handleFileUpload = async (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files)
      .filter((file) => {
        if (file.size > MAX_FILE_SIZE) {
          form.setError('attachments', {
            message: 'File size should not exceed 10MB',
          });
          return false;
        }
        if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
          form.setError('attachments', {
            message: 'File type not supported',
          });
          return false;
        }
        return true;
      })
      .map((file) => ({
        file,
        preview: URL.createObjectURL(file),
      }));

    const currentFiles = form.getValues('attachments') || [];
    form.setValue('attachments', [...currentFiles, ...newFiles]);
  };

  // Handle form submission
  const onSubmit = async (data: ServiceRequestFormData) => {
    try {
      setUploading(true);

      // Upload attachments if any
      let attachmentUrls: string[] = [];
      if (data.attachments && data.attachments.length > 0) {
        attachmentUrls = await Promise.all(
          data.attachments.map(async ({ file }) => {
            const formData = new FormData();
            formData.append('file', file);
            const response = await api.uploadFile(formData);
            return response.url;
          })
        );
      }

      // Create service request
      await api.createServiceRequest({
        ...data,
        attachments: attachmentUrls,
        estimatedCost,
      });

      // Redirect to confirmation page
      router.push('/service-request/confirmation');
    } catch (error) {
      console.error('Failed to submit service request:', error);
      form.setError('root', {
        message: 'Failed to submit service request. Please try again.',
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Category and Service Selection */}
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Category</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleCategoryChange(value);
                    }}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
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
              name="serviceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Service Type</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      handleServiceChange(value);
                    }}
                    disabled={!selectedCategory}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {selectedCategory?.services.map((service) => (
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
          </div>

          {/* Urgency Level */}
          <FormField
            control={form.control}
            name="urgencyLevel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Urgency Level</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value) => {
                    field.onChange(value);
                    if (selectedService) {
                      updateEstimatedCost(selectedService, value);
                    }
                  }}
                  disabled={!selectedService}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select urgency level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {selectedService?.urgencyLevels.map((level) => (
                      <SelectItem key={level.id} value={level.id}>
                        {level.name} - {level.responseTime}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Scheduling */}
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="preferredDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Preferred Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date() || date > new Date().setMonth(new Date().getMonth() + 3)
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferredTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preferred Time</FormLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select preferred time" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[
                        '08:00 AM',
                        '09:00 AM',
                        '10:00 AM',
                        '11:00 AM',
                        '12:00 PM',
                        '01:00 PM',
                        '02:00 PM',
                        '03:00 PM',
                        '04:00 PM',
                        '05:00 PM',
                      ].map((time) => (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Issue Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Issue Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Please describe the issue in detail..."
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Service Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Service Location</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="address.street"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter street address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter city" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter state" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address.zip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP Code</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter ZIP code" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Attachments */}
          <FormField
            control={form.control}
            name="attachments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Attachments</FormLabel>
                <FormControl>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Input
                        type="file"
                        multiple
                        accept={ACCEPTED_FILE_TYPES.join(',')}
                        onChange={(e) => handleFileUpload(e.target.files)}
                        className="hidden"
                        id="file-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('file-upload')?.click()}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Files
                      </Button>
                      <FormDescription>
                        Upload photos or documents (max 10MB each)
                      </FormDescription>
                    </div>
                    {field.value && field.value.length > 0 && (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {field.value.map((file, index) => (
                          <div
                            key={index}
                            className="relative aspect-video rounded-lg border bg-muted"
                          >
                            {file.file.type.startsWith('image/') ? (
                              <img
                                src={file.preview}
                                alt="Preview"
                                className="rounded-lg object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <span className="text-sm">
                                  {file.file.name}
                                </span>
                              </div>
                            )}
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                              onClick={() => {
                                const newFiles = [...field.value!];
                                URL.revokeObjectURL(file.preview);
                                newFiles.splice(index, 1);
                                form.setValue('attachments', newFiles);
                              }}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Additional Notes */}
          <FormField
            control={form.control}
            name="additionalNotes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Additional Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Any additional information or special instructions..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Estimated Cost */}
          {estimatedCost && (
            <div className="rounded-lg bg-muted p-4">
              <h3 className="font-medium">Estimated Cost</h3>
              <p className="text-2xl font-bold mt-2">
                ${estimatedCost.min.toFixed(2)} - ${estimatedCost.max.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Final cost may vary based on actual work required
              </p>
            </div>
          )}

          {/* Submit Button */}
          <Button type="submit" className="w-full" disabled={uploading}>
            {uploading ? 'Submitting...' : 'Submit Service Request'}
          </Button>
        </form>
      </Form>
    </div>
  );
}
