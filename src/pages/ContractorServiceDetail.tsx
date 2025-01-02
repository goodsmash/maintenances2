import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import ServiceDetailLayout from '@/components/ServiceDetailLayout';
import { services } from '@/data/servicesData';

const ContractorServiceDetail: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();

  const service = services.contractor.find(s => s.id === serviceId);

  if (!service) {
    return <Navigate to="/service/contractor" replace />;
  }

  const handleRequestService = () => {
    // Navigate to the service request form with pre-filled service type
    navigate('/request-service', {
      state: {
        serviceType: 'contractor',
        serviceId: service.id,
        serviceName: service.name
      }
    });
  };

  return (
    <ServiceDetailLayout
      service={service}
      onRequestService={handleRequestService}
    />
  );
};

export default ContractorServiceDetail;
