import React from 'react';
import { Link } from 'react-router-dom';
import { serviceCategories } from '@/data/serviceCategories';
import { maintenanceCategories } from '@/data/maintenanceCategories';
import ServiceCard from '@/components/ServiceCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const Index = () => {
  const [searchQuery, setSearchQuery] = React.useState("");

  // Group services into categories
  const essentialServices = serviceCategories.filter(cat => 
    ['plumbing', 'hvac', 'electrical', 'pest_control'].includes(cat.id)
  );
  
  const homeServices = serviceCategories.filter(cat => 
    ['landscaping', 'cleaning', 'appliance'].includes(cat.id)
  );
  
  const specialtyServices = serviceCategories.filter(cat => 
    ['security'].includes(cat.id)
  );

  const maintenanceTypes = maintenanceCategories.slice(0, 6); // Show first 6 maintenance types

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Your One-Stop Solution for Home Services
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Professional maintenance and repair services for your home and business
        </p>
        <div className="max-w-2xl mx-auto">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for services..."
                className="pl-10 py-6 text-lg"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            </div>
            <Button size="lg" className="px-8">
              Search
            </Button>
          </div>
        </div>
      </div>

      {/* Essential Services */}
      <div className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Essential Services</h2>
          <Link to="/services">
            <Button variant="outline">View All Services</Button>
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {essentialServices.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.name}
              description={service.description}
              iconName={service.icon}
              path={`/service/${service.id}`}
              services={service.services}
            />
          ))}
        </div>
      </div>

      {/* Home Services */}
      <div className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Home Services</h2>
          <Link to="/services/home">
            <Button variant="outline">View All Home Services</Button>
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {homeServices.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.name}
              description={service.description}
              iconName={service.icon}
              path={`/service/${service.id}`}
              services={service.services}
            />
          ))}
        </div>
      </div>

      {/* Maintenance Plans */}
      <div className="mb-16">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Maintenance Plans</h2>
          <Link to="/subscription">
            <Button variant="outline">View All Plans</Button>
          </Link>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {maintenanceTypes.map((maintenance) => (
            <ServiceCard
              key={maintenance.id}
              title={maintenance.name}
              description={maintenance.description || "Regular maintenance service"}
              iconName={maintenance.icon || "Tool"}
              path={`/service/page/${maintenance.id}`}
              services={[]}
            />
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 rounded-lg p-8 text-center mb-16">
        <h2 className="text-3xl font-bold mb-4">Need Emergency Service?</h2>
        <p className="text-xl text-gray-600 mb-8">
          Our professionals are available 24/7 for urgent repairs
        </p>
        <Link to="/request-service">
          <Button size="lg">Request Service Now</Button>
        </Link>
      </div>
    </div>
  );
};

export default Index;
