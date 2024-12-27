import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { api } from '@/lib/api';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentFormProps {
  clientSecret: string;
  amount: number;
  onSuccess: () => void;
  onError: (error: Error) => void;
}

function PaymentForm({ clientSecret, amount, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/confirmation`,
        },
        redirect: 'if_required',
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        toast({
          title: 'Payment Successful',
          description: `Payment of $${amount.toFixed(2)} has been processed successfully.`,
        });
        onSuccess();
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Payment failed');
      toast({
        title: 'Payment Failed',
        description: error.message,
        variant: 'destructive',
      });
      onError(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button
        type="submit"
        disabled={!stripe || processing}
        className="w-full"
      >
        {processing ? 'Processing...' : `Pay $${amount.toFixed(2)}`}
      </Button>
    </form>
  );
}

interface SavedPaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
}

interface PaymentSystemProps {
  userId: string;
  amount: number;
  description: string;
  onPaymentComplete: () => void;
}

export function PaymentSystem({ userId, amount, description, onPaymentComplete }: PaymentSystemProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [savedMethods, setSavedMethods] = useState<SavedPaymentMethod[]>([]);
  const [selectedMethod, setSelectedMethod] = useState<string | 'new'>('new');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function initialize() {
      try {
        // Load saved payment methods
        const methods = await api.getPaymentMethods(userId);
        setSavedMethods(methods);

        // Create payment intent
        const { clientSecret } = await api.createPaymentIntent({
          amount,
          description,
          userId,
        });
        setClientSecret(clientSecret);
      } catch (error) {
        console.error('Failed to initialize payment:', error);
        toast({
          title: 'Error',
          description: 'Failed to initialize payment system. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    initialize();
  }, [userId, amount, description]);

  const handlePaymentSuccess = async () => {
    try {
      await api.recordPayment({
        userId,
        amount,
        description,
        status: 'completed',
      });
      onPaymentComplete();
    } catch (error) {
      console.error('Failed to record payment:', error);
    }
  };

  const handlePaymentError = (error: Error) => {
    console.error('Payment failed:', error);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {savedMethods.length > 0 && (
          <div className="space-y-4">
            <label className="block text-sm font-medium">Payment Method</label>
            <Select
              value={selectedMethod}
              onValueChange={(value) => setSelectedMethod(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New Card</SelectItem>
                {savedMethods.map((method) => (
                  <SelectItem key={method.id} value={method.id}>
                    {method.brand} •••• {method.last4} (expires {method.expMonth}/{method.expYear})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {clientSecret && (
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
              amount={amount}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </Elements>
        )}
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <p className="text-sm text-gray-500">
          Your payment is processed securely through Stripe. We never store your card details.
        </p>
        <div className="flex items-center justify-center space-x-2">
          <img
            src="/images/payment/visa.svg"
            alt="Visa"
            className="h-8"
          />
          <img
            src="/images/payment/mastercard.svg"
            alt="Mastercard"
            className="h-8"
          />
          <img
            src="/images/payment/amex.svg"
            alt="American Express"
            className="h-8"
          />
        </div>
      </CardFooter>
    </Card>
  );
}
