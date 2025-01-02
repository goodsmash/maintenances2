import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import ContractorServices from './pages/ContractorServices';
import ContractorServiceDetail from './pages/ContractorServiceDetail';
import ApplianceServices from './pages/ApplianceServices';
import ServiceRequestForm from './pages/ServiceRequestForm';
import { ProtectedRoute } from './components/ProtectedRoute';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import ServiceCategory from './pages/ServiceCategory';
import CommercialServices from './pages/CommercialServices';
import CommercialServiceCategory from './pages/CommercialServiceCategory';
import PaintingServices from './pages/PaintingServices';
import PaintingServiceCategory from './pages/PaintingServiceCategory';
import Subscription from './pages/Subscription';
import ServicePage from './pages/ServicePage';
import Settings from './pages/settings';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Main Routes */}
      <Route path="/" element={<Index />} />
      
      {/* Service Category Routes */}
      <Route path="/service/:categoryId" element={<ServiceCategory />} />
      <Route path="/service/page/:serviceId" element={<ServicePage />} />
      
      {/* Legacy Service Routes */}
      <Route path="/service/contractor" element={<ContractorServices />} />
      <Route path="/service/contractor/:serviceId" element={<ContractorServiceDetail />} />
      <Route path="/service/appliance" element={<ApplianceServices />} />
      <Route path="/service/commercial" element={<CommercialServices />} />
      <Route path="/service/commercial/:category" element={<CommercialServiceCategory />} />
      <Route path="/service/painting" element={<PaintingServices />} />
      <Route path="/service/painting/:category" element={<PaintingServiceCategory />} />
      
      {/* Form Routes */}
      <Route path="/request-service" element={<ServiceRequestForm />} />
      
      {/* Protected Routes */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/subscription"
        element={
          <ProtectedRoute>
            <Subscription />
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
