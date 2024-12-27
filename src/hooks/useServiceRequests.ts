import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { ServiceRequest } from '@/types';

export function useServiceRequests(userId?: string) {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchRequests() {
      try {
        setLoading(true);
        const data = await api.getServiceRequests(userId);
        setRequests(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch service requests'));
      } finally {
        setLoading(false);
      }
    }

    fetchRequests();
  }, [userId]);

  const createRequest = async (data: Partial<ServiceRequest>) => {
    try {
      const newRequest = await api.createServiceRequest(data);
      setRequests(prev => [...prev, newRequest]);
      return newRequest;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create service request');
    }
  };

  const updateRequest = async (id: string, data: Partial<ServiceRequest>) => {
    try {
      const updatedRequest = await api.updateServiceRequest(id, data);
      setRequests(prev => prev.map(req => req.id === id ? updatedRequest : req));
      return updatedRequest;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update service request');
    }
  };

  return {
    requests,
    loading,
    error,
    createRequest,
    updateRequest,
  };
}
