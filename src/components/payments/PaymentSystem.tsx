import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { api } from '@/lib/api';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentDetails {
  amount: number;
  currency: string;
  description: string;
  metadata: {
    serviceRequestId: string;
    customerId: string;
    contractorId: string;
  };
}

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  createdAt: string;
  paymentMethod: {
    type: string;
    last4: string;
    brand: string;
  };
  receipt?: string;
}

interface PaymentHistoryProps {
  customerId: string;
}

const paymentSchema = z.object({
  paymentMethod: z.string().min(1, 'Payment method is required'),
  saveCard: z.boolean().optional(),
  billingAddress: z.object({
    line1: z.string().min(1, 'Address is required'),
    line2: z.string().optional(),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().min(5, 'Valid postal code is required'),
    country: z.string().min(1, 'Country is required'),
  }),
});

function PaymentForm({ clientSecret, paymentDetails }: { clientSecret: string; paymentDetails: PaymentDetails }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const form = useForm({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      paymentMethod: '',
      saveCard: false,
      billingAddress: {
        line1: '',
        line2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'US',
      },
    },
  });

  const onSubmit = async (data: any) => {
    if (!stripe || !elements) return;

    try {
      setLoading(true);

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          payment_method_data: {
            billing_details: {
              address: data.billingAddress,
            },
          },
          return_url: `${window.location.origin}/payment/confirmation`,
          save_payment_method: data.saveCard,
        },
      });

      if (error) {
        toast({
          title: 'Payment Failed',
          description: error.message,
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Payment Successful',
          description: 'Your payment has been processed successfully',
        });
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Error',
        description: 'An error occurred while processing your payment',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>
              Amount to pay: {paymentDetails.currency.toUpperCase()}{' '}
              {paymentDetails.amount.toFixed(2)}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <PaymentElement />

            <FormField
              control={form.control}
              name="saveCard"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormControl>
                    <input type="checkbox" {...field} />
                  </FormControl>
                  <FormLabel className="!mt-0">Save card for future payments</FormLabel>
                </FormItem>
              )}
            />

            <div className="space-y-4">
              <h3 className="font-medium">Billing Address</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="billingAddress.line1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 1</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="billingAddress.line2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address Line 2</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="billingAddress.city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="billingAddress.state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="billingAddress.postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="billingAddress.country"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Country</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select country" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="US">United States</SelectItem>
                          <SelectItem value="CA">Canada</SelectItem>
                          {/* Add more countries as needed */}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading || !stripe}>
              {loading ? 'Processing...' : 'Pay Now'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

function PaymentHistory({ customerId }: PaymentHistoryProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadTransactions();
  }, [customerId]);

  const loadTransactions = async () => {
    try {
      setLoading(true);
      const response = await api.getTransactions(customerId);
      setTransactions(response);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load transaction history',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Payment History</h2>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <Card key={transaction.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg">
                    {transaction.currency.toUpperCase()} {transaction.amount.toFixed(2)}
                  </CardTitle>
                  <CardDescription>
                    {format(new Date(transaction.createdAt), 'PPP')}
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    transaction.status === 'completed'
                      ? 'success'
                      : transaction.status === 'failed'
                      ? 'destructive'
                      : 'secondary'
                  }
                >
                  {transaction.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Payment Method</p>
                  <p>
                    {transaction.paymentMethod.brand} ending in{' '}
                    {transaction.paymentMethod.last4}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Transaction ID</p>
                  <p className="font-mono">{transaction.id}</p>
                </div>
              </div>
            </CardContent>
            {transaction.receipt && (
              <CardFooter>
                <a
                  href={transaction.receipt}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  View Receipt
                </a>
              </CardFooter>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}

export function PaymentSystem({
  paymentDetails,
  customerId,
}: {
  paymentDetails: PaymentDetails;
  customerId: string;
}) {
  const [clientSecret, setClientSecret] = useState<string>('');

  useEffect(() => {
    initializePayment();
  }, [paymentDetails]);

  const initializePayment = async () => {
    try {
      const { clientSecret } = await api.createPaymentIntent(paymentDetails);
      setClientSecret(clientSecret);
    } catch (error) {
      console.error('Failed to initialize payment:', error);
    }
  };

  if (!clientSecret) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Elements
        stripe={stripePromise}
        options={{
          clientSecret,
          appearance: {
            theme: 'stripe',
          },
        }}
      >
        <PaymentForm
          clientSecret={clientSecret}
          paymentDetails={paymentDetails}
        />
      </Elements>

      <PaymentHistory customerId={customerId} />
    </div>
  );
}
