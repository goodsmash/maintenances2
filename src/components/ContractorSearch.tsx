import { useState } from 'react';
import { useContractors } from '@/hooks/useContractors';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, MapPin, Clock, DollarSign, Loader2 } from 'lucide-react';

const serviceTypes = [
  'all',
  'plumbing',
  'electrical',
  'hvac',
  'carpentry',
  'painting',
  'general_maintenance',
] as const;

export function ContractorSearch() {
  const [filters, setFilters] = useState({
    serviceType: 'all',
    location: '',
  });

  const { contractors, loading, error } = useContractors(
    filters.serviceType === 'all' ? { location: filters.location } : filters
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filters are automatically applied through the useContractors hook
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex gap-4">
        <Select
          value={filters.serviceType}
          onValueChange={(value) => setFilters({ ...filters, serviceType: value })}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Service Type" />
          </SelectTrigger>
          <SelectContent>
            {serviceTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type === 'all' ? 'All Services' : type.replace('_', ' ').toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Enter location..."
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="flex-1"
        />

        <Button type="submit">Search</Button>
      </form>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="animate-spin" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">
          Error loading contractors: {error.message}
        </div>
      ) : contractors.length === 0 ? (
        <div className="text-center text-gray-500">
          No contractors found matching your criteria.
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {contractors.map((contractor) => (
            <Card key={contractor.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold">{contractor.companyName}</h3>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="fill-current h-4 w-4" />
                      <span>{contractor.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => window.location.href = `/contractors/${contractor.id}`}>
                    View Profile
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {contractor.services.map((service) => (
                      <Badge key={service} variant="secondary">
                        {service.replace('_', ' ').toUpperCase()}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{contractor.serviceAreas.join(', ')}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span>
                        {contractor.availability.emergencyAvailable ? 'Emergency Service Available' : 'Standard Hours Only'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-500" />
                      <span>Starting at ${contractor.pricing.minimumCharge}/visit</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
