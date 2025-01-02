import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface PaymentSystemProps {
  amount: number;
  planName: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const PaymentSystem: React.FC<PaymentSystemProps> = ({
  amount,
  planName,
  onSuccess,
  onCancel,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePayment = async () => {
    // TODO: Implement actual payment processing
    // For now, just simulate a successful payment
    toast({
      title: "Payment Processing",
      description: "Your payment is being processed...",
      duration: 2000,
    });

    setTimeout(() => {
      toast({
        title: "Payment Successful",
        description: `Successfully subscribed to ${planName}`,
        duration: 3000,
      });
      onSuccess?.();
      navigate('/dashboard');
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Subscribe to {planName}</CardTitle>
        <CardDescription>
          Complete your subscription payment
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span>Plan</span>
            <span className="font-medium">{planName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span>Amount</span>
            <span className="font-medium">${amount.toFixed(2)}/month</span>
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between items-center font-bold">
              <span>Total</span>
              <span>${amount.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex gap-4">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={handlePayment}
          className="flex-1"
        >
          Pay Now
        </Button>
      </CardFooter>
    </Card>
  );
};
