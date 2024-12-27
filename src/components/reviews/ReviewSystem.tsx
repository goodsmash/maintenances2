import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Star, StarHalf } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { api } from '@/lib/api';

interface Review {
  id: string;
  userId: string;
  serviceRequestId: string;
  contractorId: string;
  rating: number;
  review: string;
  categories: {
    professionalism: number;
    punctuality: number;
    workQuality: number;
    communication: number;
    valueForMoney: number;
  };
  photos: string[];
  createdAt: string;
  updatedAt: string;
  user: {
    name: string;
    avatar?: string;
  };
  serviceRequest: {
    service: {
      name: string;
      category: string;
    };
  };
  contractor: {
    name: string;
  };
  helpful: number;
  response?: {
    text: string;
    createdAt: string;
  };
}

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  review: z.string().min(10, 'Review must be at least 10 characters'),
  categories: z.object({
    professionalism: z.number().min(1).max(5),
    punctuality: z.number().min(1).max(5),
    workQuality: z.number().min(1).max(5),
    communication: z.number().min(1).max(5),
    valueForMoney: z.number().min(1).max(5),
  }),
  photos: z.array(z.string()).optional(),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewSystemProps {
  serviceRequestId: string;
  contractorId: string;
}

export function ReviewSystem({ serviceRequestId, contractorId }: ReviewSystemProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      review: '',
      categories: {
        professionalism: 0,
        punctuality: 0,
        workQuality: 0,
        communication: 0,
        valueForMoney: 0,
      },
      photos: [],
    },
  });

  useEffect(() => {
    loadReviews();
  }, [serviceRequestId, contractorId]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const response = await api.getReviews({ serviceRequestId, contractorId });
      setReviews(response);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load reviews',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ReviewFormData) => {
    try {
      setLoading(true);
      await api.createReview({
        ...data,
        serviceRequestId,
        contractorId,
      });
      toast({
        title: 'Success',
        description: 'Review submitted successfully',
      });
      setIsDialogOpen(false);
      loadReviews();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit review',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkHelpful = async (reviewId: string) => {
    try {
      await api.markReviewHelpful(reviewId);
      loadReviews();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark review as helpful',
        variant: 'destructive',
      });
    }
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalf
          key="half"
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />
      );
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          className="h-4 w-4 text-gray-300"
        />
      );
    }

    return stars;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Reviews & Ratings</h2>
          <p className="text-gray-500">
            {reviews.length} reviews for this service
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Write a Review</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Write a Review</DialogTitle>
              <DialogDescription>
                Share your experience with this service
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Overall Rating</FormLabel>
                      <FormControl>
                        <div className="flex space-x-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              type="button"
                              onClick={() => field.onChange(rating)}
                              className={`p-1 ${
                                field.value >= rating
                                  ? 'text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            >
                              <Star
                                className={`h-8 w-8 ${
                                  field.value >= rating && 'fill-current'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {Object.entries(form.getValues().categories).map(
                  ([category, _]) => (
                    <FormField
                      key={category}
                      control={form.control}
                      name={`categories.${category}` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="capitalize">
                            {category.replace(/([A-Z])/g, ' $1').trim()}
                          </FormLabel>
                          <FormControl>
                            <div className="flex space-x-2">
                              {[1, 2, 3, 4, 5].map((rating) => (
                                <button
                                  key={rating}
                                  type="button"
                                  onClick={() => field.onChange(rating)}
                                  className={`p-1 ${
                                    field.value >= rating
                                      ? 'text-yellow-400'
                                      : 'text-gray-300'
                                  }`}
                                >
                                  <Star
                                    className={`h-6 w-6 ${
                                      field.value >= rating && 'fill-current'
                                    }`}
                                  />
                                </button>
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )
                )}

                <FormField
                  control={form.control}
                  name="review"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Review</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Share your experience with this service..."
                          className="min-h-[100px]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="photos"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Photos</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={async (e) => {
                            const files = Array.from(e.target.files || []);
                            const urls = await Promise.all(
                              files.map(async (file) => {
                                const response = await api.uploadImage(file);
                                return response.url;
                              })
                            );
                            field.onChange([...(field.value || []), ...urls]);
                          }}
                        />
                      </FormControl>
                      <FormDescription>
                        Upload photos of the completed work (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Submitting...' : 'Submit Review'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-6">
        {reviews.map((review) => (
          <Card key={review.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {review.user.avatar ? (
                    <img
                      src={review.user.avatar}
                      alt={review.user.name}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-lg font-medium">
                        {review.user.name[0]}
                      </span>
                    </div>
                  )}
                  <div>
                    <CardTitle className="text-lg">{review.user.name}</CardTitle>
                    <CardDescription>
                      {format(new Date(review.createdAt), 'PPP')}
                    </CardDescription>
                  </div>
                </div>
                <div className="flex items-center">
                  {renderStars(review.rating)}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{review.review}</p>
              {review.photos && review.photos.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {review.photos.map((photo, index) => (
                    <img
                      key={index}
                      src={photo}
                      alt={`Review photo ${index + 1}`}
                      className="rounded-lg object-cover aspect-square"
                    />
                  ))}
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                {Object.entries(review.categories).map(([category, rating]) => (
                  <div key={category}>
                    <p className="text-sm font-medium capitalize">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <div className="flex items-center">
                      {renderStars(rating)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleMarkHelpful(review.id)}
              >
                Helpful ({review.helpful})
              </Button>
              {review.response && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium mb-2">Response from contractor:</p>
                  <p className="text-sm text-gray-600">{review.response.text}</p>
                  <p className="text-xs text-gray-400 mt-2">
                    {format(new Date(review.response.createdAt), 'PPP')}
                  </p>
                </div>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
