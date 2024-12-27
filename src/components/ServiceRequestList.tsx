import { ServiceRequest } from '@/types';
import { useServiceRequests } from '@/hooks/useServiceRequests';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const statusColors = {
  pending: 'bg-yellow-500',
  assigned: 'bg-blue-500',
  in_progress: 'bg-purple-500',
  completed: 'bg-green-500',
  cancelled: 'bg-red-500',
} as const;

const priorityColors = {
  low: 'bg-gray-500',
  medium: 'bg-blue-500',
  high: 'bg-orange-500',
  emergency: 'bg-red-500',
} as const;

interface ServiceRequestCardProps {
  request: ServiceRequest;
  onStatusUpdate?: (id: string, status: ServiceRequest['status']) => void;
}

function ServiceRequestCard({ request, onStatusUpdate }: ServiceRequestCardProps) {
  const formattedDate = new Date(request.createdAt).toLocaleDateString();
  const formattedTime = new Date(request.createdAt).toLocaleTimeString();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{request.serviceType.replace('_', ' ').toUpperCase()}</CardTitle>
            <CardDescription>Created on {formattedDate} at {formattedTime}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge className={statusColors[request.status]}>
              {request.status.replace('_', ' ').toUpperCase()}
            </Badge>
            <Badge className={priorityColors[request.priority]}>
              {request.priority.toUpperCase()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold">Description</h4>
            <p>{request.description}</p>
          </div>
          <div>
            <h4 className="font-semibold">Location</h4>
            <p>{request.location.address}</p>
            {request.location.unit && <p>Unit: {request.location.unit}</p>}
            {request.location.accessInstructions && (
              <p className="text-sm text-gray-600">
                Access: {request.location.accessInstructions}
              </p>
            )}
          </div>
          <div>
            <h4 className="font-semibold">Schedule</h4>
            <p>
              {new Date(request.preferredSchedule.date).toLocaleDateString()}
              {' '}({request.preferredSchedule.timeSlots.join(', ')})
            </p>
          </div>
          {request.estimatedCost && (
            <div>
              <h4 className="font-semibold">Estimated Cost</h4>
              <p>${request.estimatedCost.toFixed(2)}</p>
            </div>
          )}
        </div>
      </CardContent>
      {onStatusUpdate && request.status !== 'completed' && request.status !== 'cancelled' && (
        <CardFooter className="flex justify-end gap-2">
          {request.status === 'pending' && (
            <Button
              variant="outline"
              onClick={() => onStatusUpdate(request.id, 'assigned')}
            >
              Assign
            </Button>
          )}
          {request.status === 'assigned' && (
            <Button
              variant="outline"
              onClick={() => onStatusUpdate(request.id, 'in_progress')}
            >
              Start Work
            </Button>
          )}
          {request.status === 'in_progress' && (
            <Button
              variant="outline"
              onClick={() => onStatusUpdate(request.id, 'completed')}
            >
              Mark Complete
            </Button>
          )}
          <Button
            variant="destructive"
            onClick={() => onStatusUpdate(request.id, 'cancelled')}
          >
            Cancel
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

interface ServiceRequestListProps {
  userId?: string;
}

export function ServiceRequestList({ userId }: ServiceRequestListProps) {
  const { requests, loading, error, updateRequest } = useServiceRequests(userId);

  const handleStatusUpdate = async (id: string, status: ServiceRequest['status']) => {
    try {
      await updateRequest(id, { status });
    } catch (error) {
      console.error('Failed to update request status:', error);
    }
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
        Error loading service requests: {error.message}
      </div>
    );
  }

  if (!requests.length) {
    return (
      <div className="text-center text-gray-500">
        No service requests found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {requests.map((request) => (
        <ServiceRequestCard
          key={request.id}
          request={request}
          onStatusUpdate={handleStatusUpdate}
        />
      ))}
    </div>
  );
}
