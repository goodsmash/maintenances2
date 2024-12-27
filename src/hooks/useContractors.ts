import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Contractor } from '@/types';

export function useContractors(filters?: Record<string, any>) {
  const [contractors, setContractors] = useState<Contractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchContractors() {
      try {
        setLoading(true);
        const data = await api.getContractors(filters);
        setContractors(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch contractors'));
      } finally {
        setLoading(false);
      }
    }

    fetchContractors();
  }, [filters]);

  const getContractorById = async (id: string) => {
    try {
      return await api.getContractorById(id);
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to fetch contractor');
    }
  };

  const createReview = async (contractorId: string, data: { rating: number; comment: string }) => {
    try {
      await api.createReview(contractorId, data);
      // Refresh contractor data to get updated rating
      const updatedContractor = await api.getContractorById(contractorId);
      setContractors(prev => prev.map(c => c.id === contractorId ? updatedContractor : c));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create review');
    }
  };

  return {
    contractors,
    loading,
    error,
    getContractorById,
    createReview,
  };
}
