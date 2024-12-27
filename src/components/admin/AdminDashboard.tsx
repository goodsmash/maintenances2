import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { UserManagement } from './UserManagement';
import { LeadManagement } from './LeadManagement';
import { SubscriptionManagement } from './SubscriptionManagement';
import { ServiceManagement } from './ServiceManagement';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { ContractorManagement } from './ContractorManagement';
import { useAuth } from '../../hooks/useAuth';

export function AdminDashboard() {
  const { user } = useAuth();

  if (!user || user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-screen">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-red-600">Access Denied</h2>
            <p className="mt-2">You don't have permission to access this area.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <Tabs defaultValue="leads" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="leads">Leads</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="contractors">Contractors</TabsTrigger>
        </TabsList>

        <TabsContent value="leads">
          <Card>
            <CardHeader>
              <CardTitle>Lead Management</CardTitle>
            </CardHeader>
            <CardContent>
              <LeadManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <UserManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subscriptions">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Management</CardTitle>
            </CardHeader>
            <CardContent>
              <SubscriptionManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <Card>
            <CardHeader>
              <CardTitle>Service Management</CardTitle>
            </CardHeader>
            <CardContent>
              <ServiceManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <AnalyticsDashboard />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contractors">
          <Card>
            <CardHeader>
              <CardTitle>Contractor Management</CardTitle>
            </CardHeader>
            <CardContent>
              <ContractorManagement />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
