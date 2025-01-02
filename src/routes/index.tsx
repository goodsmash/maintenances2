import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { withAuthenticationRequired } from '@auth0/auth0-react';

// Pages
import Index from '@/pages/Index';
import ContractorServices from '@/pages/ContractorServices';
import ApplianceServices from '@/pages/ApplianceServices';
import ContractorServiceCategory from '@/pages/ContractorServiceCategory';
import ApplianceServiceCategory from '@/pages/ApplianceServiceCategory';
import ServiceRequestForm from '@/pages/ServiceRequestForm';
import Dashboard from '@/pages/Dashboard';
import Profile from '@/pages/Profile';
import ServiceCategory from '@/pages/ServiceCategory';
import CommercialServices from '@/pages/CommercialServices';
import CommercialServiceCategory from '@/pages/CommercialServiceCategory';
import PaintingServices from '@/pages/PaintingServices';
import PaintingServiceCategory from '@/pages/PaintingServiceCategory';
import Subscription from '@/pages/Subscription';
import ServicePage from '@/pages/ServicePage';

// Protected route wrapper
const ProtectedRoute = ({ component: Component, ...args }: any) => {
  const WrappedComponent = withAuthenticationRequired(Component, {
    onRedirecting: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
      </div>
    ),
  });

  return <WrappedComponent {...args} />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      
      {/* Service Category Routes */}
      <Route path="/service/:categoryId" element={<ServiceCategory />} />
      <Route path="/service/page/:serviceId" element={<ServicePage />} />
      
      {/* Legacy Service Routes - Keep for backward compatibility */}
      <Route path="/service/contractor" element={<ContractorServices />} />
      <Route path="/service/contractor/:category" element={<ContractorServiceCategory />} />
      <Route path="/service/appliance" element={<ApplianceServices />} />
      <Route path="/service/appliance/:category" element={<ApplianceServiceCategory />} />
      <Route path="/service/commercial" element={<CommercialServices />} />
      <Route path="/service/commercial/:category" element={<CommercialServiceCategory />} />
      <Route path="/service/painting" element={<PaintingServices />} />
      <Route path="/service/painting/:category" element={<PaintingServiceCategory />} />
      
      {/* Form Routes */}
      <Route path="/request-service" element={<ServiceRequestForm />} />
      
      {/* User Routes - Protected */}
      <Route path="/dashboard" element={<ProtectedRoute component={Dashboard} />} />
      <Route path="/profile" element={<ProtectedRoute component={Profile} />} />
      <Route path="/subscription" element={<ProtectedRoute component={Subscription} />} />
    </Routes>
  );
};

export default AppRoutes;
