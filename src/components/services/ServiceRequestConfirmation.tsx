import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';
import { CheckCircle, Calendar, MapPin, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
} from '@/components/ui/dialog';
import { api } from '@/lib/api';
import { format } from 'date-fns';

interface ServiceRequestDetails {
  id: string;
  status: 'pending' | 'confirmed' | 'assigned' | 'in_progress' | 'completed';
  category: string;
  service: string;
  description: string;
  urgencyLevel: string;
  preferredDate: string;
  preferredTime: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  estimatedCost: {
    min: number;
    max: number;
  };
  contractor?: {
    id: string;
    name: string;
    rating: number;
    phone: string;
    estimatedArrival?: string;
  };
}

export function ServiceRequestConfirmation() {
  const router = useRouter();
  const { requestId } = router.query;
  const [request, setRequest] = useState<ServiceRequestDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    async function loadRequestDetails() {
      if (!requestId) return;

      try {
        const details = await api.getServiceRequestDetails(requestId as string);
        setRequest(details);
      } catch (error) {
        console.error('Failed to load request details:', error);
      } finally {
        setLoading(false);
      }
    }

    loadRequestDetails();
  }, [requestId]);

  const handleCancelRequest = async () => {
    if (!request) return;

    try {
      setCancelling(true);
      await api.cancelServiceRequest(request.id);
      router.push('/dashboard');
    } catch (error) {
      console.error('Failed to cancel request:', error);
    } finally {
      setCancelling(false);
      setShowCancelDialog(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!request) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive" />
        <h2 className="mt-4 text-lg font-semibold">Request Not Found</h2>
        <p className="mt-2 text-gray-500">
          The service request could not be found
        </p>
        <Button
          className="mt-6"
          onClick={() => router.push('/dashboard')}
        >
          Return to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Confirmation Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold">Service Request Confirmed</h1>
        <p className="text-gray-500 mt-2">
          Your request has been successfully submitted
        </p>
      </motion.div>

      {/* Request Details */}
      <Card>
        <CardHeader>
          <CardTitle>Request Details</CardTitle>
          <CardDescription>
            Reference ID: {request.id}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="font-medium mb-2">Service Information</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-500">Category:</span>{' '}
                  {request.category}
                </p>
                <p>
                  <span className="text-gray-500">Service:</span>{' '}
                  {request.service}
                </p>
                <p>
                  <span className="text-gray-500">Urgency:</span>{' '}
                  {request.urgencyLevel}
                </p>
                <p>
                  <span className="text-gray-500">Status:</span>{' '}
                  <span className="capitalize">{request.status}</span>
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Schedule</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  {format(new Date(request.preferredDate), 'MMMM d, yyyy')}
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  {request.preferredTime}
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Location</h3>
            <div className="flex items-start">
              <MapPin className="h-4 w-4 mr-2 mt-1 text-gray-500" />
              <div>
                <p>{request.address.street}</p>
                <p>
                  {request.address.city}, {request.address.state}{' '}
                  {request.address.zip}
                </p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Issue Description</h3>
            <p className="text-sm">{request.description}</p>
          </div>

          <div>
            <h3 className="font-medium mb-2">Estimated Cost</h3>
            <p className="text-2xl font-bold">
              ${request.estimatedCost.min.toFixed(2)} -{' '}
              ${request.estimatedCost.max.toFixed(2)}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Final cost may vary based on actual work required
            </p>
          </div>

          {request.contractor && (
            <div>
              <h3 className="font-medium mb-2">Assigned Contractor</h3>
              <div className="space-y-2 text-sm">
                <p>
                  <span className="text-gray-500">Name:</span>{' '}
                  {request.contractor.name}
                </p>
                <p>
                  <span className="text-gray-500">Rating:</span>{' '}
                  {request.contractor.rating} / 5
                </p>
                <p>
                  <span className="text-gray-500">Contact:</span>{' '}
                  {request.contractor.phone}
                </p>
                {request.contractor.estimatedArrival && (
                  <p>
                    <span className="text-gray-500">
                      Estimated Arrival:
                    </span>{' '}
                    {format(
                      new Date(request.contractor.estimatedArrival),
                      'h:mm a'
                    )}
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setShowCancelDialog(true)}
          >
            Cancel Request
          </Button>
          <Button onClick={() => router.push('/dashboard')}>
            View Dashboard
          </Button>
        </CardFooter>
      </Card>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start space-x-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
              1
            </div>
            <div>
              <p className="font-medium">Contractor Assignment</p>
              <p className="text-sm text-gray-500">
                We are matching your request with available contractors in your
                area
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
              2
            </div>
            <div>
              <p className="font-medium">Confirmation Call</p>
              <p className="text-sm text-gray-500">
                The assigned contractor will contact you to confirm details
              </p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20">
              3
            </div>
            <div>
              <p className="font-medium">Service Delivery</p>
              <p className="text-sm text-gray-500">
                The contractor will arrive at the scheduled time to perform the
                service
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Dialog */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Service Request</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this service request? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCancelDialog(false)}
              disabled={cancelling}
            >
              Keep Request
            </Button>
            <Button
              variant="destructive"
              onClick={handleCancelRequest}
              disabled={cancelling}
            >
              {cancelling ? 'Cancelling...' : 'Yes, Cancel Request'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
