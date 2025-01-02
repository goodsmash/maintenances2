import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { PaymentSystem } from '../components/PaymentSystem';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    id: 'basic',
    name: 'Basic Plan',
    price: 15,
    period: 'month',
    features: [
      'Submit maintenance requests',
      'Access to vetted contractors',
      'Basic support',
      'Email notifications'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Plan',
    price: 25,
    period: 'month',
    features: [
      'All Basic Plan features',
      'Priority service',
      'Phone support',
      'Detailed service history',
      'Custom maintenance schedules',
      'Emergency response'
    ]
  }
];

export default function SubscriptionPage() {
  const [selectedPlan, setSelectedPlan] = useState<typeof plans[0] | null>(null);
  const navigate = useNavigate();

  const handleCancel = () => {
    setSelectedPlan(null);
  };

  const handleSuccess = () => {
    navigate('/dashboard');
  };

  if (selectedPlan) {
    return (
      <div className="container mx-auto py-12">
        <PaymentSystem
          amount={selectedPlan.price}
          planName={selectedPlan.name}
          onCancel={handleCancel}
          onSuccess={handleSuccess}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h1>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.id} className="relative">
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold">
                ${plan.price}
                <span className="text-base font-normal">/{plan.period}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button
                className="w-full mt-6"
                onClick={() => setSelectedPlan(plan)}
              >
                Subscribe Now
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
