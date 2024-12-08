import React from 'react';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Check } from "lucide-react";

const plans = [
  {
    name: 'Basic Plan',
    price: '$15',
    period: 'month',
    features: [
      'Submit maintenance requests',
      'Access to vetted contractors',
      'Basic support',
      'Email notifications'
    ]
  },
  {
    name: 'Premium Plan',
    price: '$25',
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
  const handleSubscribe = async (planName: string) => {
    // TODO: Implement Stripe checkout
    console.log(`Subscribing to ${planName}`);
  };

  return (
    <div className="container mx-auto py-12">
      <h1 className="text-3xl font-bold text-center mb-8">Choose Your Plan</h1>
      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.name} className="relative">
            <CardHeader>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <div className="text-3xl font-bold">
                {plan.price}
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
                onClick={() => handleSubscribe(plan.name)}
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
