import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { subscriptionPlans, SubscriptionPlan } from '../../lib/subscription';
import { supabase } from '../../lib/auth';

interface SubscriptionStats {
  total_subscriptions: number;
  active_subscriptions: number;
  revenue_this_month: number;
  subscriptions_by_tier: {
    [key: string]: number;
  };
}

export function SubscriptionManagement() {
  const [stats, setStats] = useState<SubscriptionStats | null>(null);
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscriptionStats();
  }, []);

  async function fetchSubscriptionStats() {
    try {
      const { data: subscriptions, error } = await supabase
        .from('subscriptions')
        .select('*');

      if (error) throw error;

      // Calculate stats
      const stats: SubscriptionStats = {
        total_subscriptions: subscriptions.length,
        active_subscriptions: subscriptions.filter(s => s.status === 'active').length,
        revenue_this_month: subscriptions.reduce((acc, s) => {
          if (s.status === 'active') {
            const plan = subscriptionPlans.find(p => p.id === s.plan_id);
            return acc + (plan?.price || 0);
          }
          return acc;
        }, 0),
        subscriptions_by_tier: subscriptions.reduce((acc, s) => {
          acc[s.plan_id] = (acc[s.plan_id] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      };

      setStats(stats);
    } catch (error) {
      console.error('Error fetching subscription stats:', error);
    } finally {
      setLoading = false;
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.total_subscriptions}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.active_subscriptions}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats?.revenue_this_month.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Conversion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.total_subscriptions
                ? Math.round((stats.active_subscriptions / stats.total_subscriptions) * 100)
                : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Plans */}
      <Card>
        <CardHeader>
          <CardTitle>Subscription Plans</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscriptionPlans.map(plan => (
              <Card key={plan.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold">{plan.name}</h3>
                      <p className="text-sm text-gray-500">{plan.description}</p>
                      <div className="mt-2">
                        <span className="text-2xl font-bold">${plan.price}</span>
                        <span className="text-gray-500">/{plan.interval}</span>
                      </div>
                      <ul className="mt-4 space-y-2">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <span className="text-green-500 mr-2">✓</span>
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="text-sm font-medium">
                        {stats?.subscriptions_by_tier[plan.id] || 0} subscribers
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
