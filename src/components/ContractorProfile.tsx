import { useState } from 'react';
import { useContractors } from '@/hooks/useContractors';
import { ContractorReview } from '@/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import {
  Star,
  MapPin,
  Clock,
  DollarSign,
  Shield,
  Calendar,
  Phone,
  Mail,
  Loader2,
} from 'lucide-react';

interface ContractorProfileProps {
  contractorId: string;
}

export function ContractorProfile({ contractorId }: ContractorProfileProps) {
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { getContractorById, createReview } = useContractors();
  const { toast } = useToast();
  const [contractor, setContractor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useState(() => {
    async function loadContractor() {
      try {
        const data = await getContractorById(contractorId);
        setContractor(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load contractor'));
      } finally {
        setLoading(false);
      }
    }
    loadContractor();
  }, [contractorId]);

  const handleReviewSubmit = async () => {
    try {
      setIsSubmitting(true);
      await createReview(contractorId, { rating, comment });
      setIsReviewDialogOpen(false);
      toast({
        title: 'Review Submitted',
        description: 'Thank you for your feedback!',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit review. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
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
        Error loading contractor profile: {error.message}
      </div>
    );
  }

  if (!contractor) {
    return (
      <div className="text-center text-gray-500">
        Contractor not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-2xl">{contractor.companyName}</CardTitle>
              <CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center gap-1 text-yellow-500">
                    <Star className="fill-current h-5 w-5" />
                    <span className="text-lg">{contractor.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-gray-500">•</span>
                  <span>{contractor.serviceAreas.length} service areas</span>
                </div>
              </CardDescription>
            </div>
            <Button onClick={() => window.location.href = `/request/${contractorId}`}>
              Request Service
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Services</h3>
                <div className="flex flex-wrap gap-2">
                  {contractor.services.map((service) => (
                    <Badge key={service} variant="secondary">
                      {service.replace('_', ' ').toUpperCase()}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Service Areas</h3>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <span>{contractor.serviceAreas.join(', ')}</span>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Availability</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <span>
                      {contractor.availability.schedule.map((s) => 
                        `${s.day}: ${s.hours.join(', ')}`
                      ).join('\n')}
                    </span>
                  </div>
                  {contractor.availability.emergencyAvailable && (
                    <Badge variant="default">24/7 Emergency Service</Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Pricing</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-gray-500" />
                    <span>Base Rate: ${contractor.pricing.hourlyRate}/hour</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Minimum charge: ${contractor.pricing.minimumCharge}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Credentials</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-gray-500" />
                    <span>License: {contractor.licenseNumber}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <span>
                      Insurance valid until{' '}
                      {new Date(contractor.insuranceInfo.expirationDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Contact</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full" asChild>
                    <a href={`tel:${contractor.phoneNumber}`}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call Now
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full" asChild>
                    <a href={`mailto:${contractor.email}`}>
                      <Mail className="h-4 w-4 mr-2" />
                      Send Email
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Write a Review</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
            <DialogDescription>
              Share your experience with {contractor.companyName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Rating</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className={`p-1 ${rating >= value ? 'text-yellow-500' : 'text-gray-300'}`}
                  >
                    <Star className="h-6 w-6 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Comment</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share details of your experience..."
                rows={4}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsReviewDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReviewSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
