import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { serviceCategories } from '@/data/serviceCategories';
import { 
  Droplet, 
  Thermometer, 
  Zap, 
  Bug, 
  Scissors, 
  Trash2, 
  Shield, 
  Wrench 
} from 'lucide-react';

const iconMap = {
  'Droplet': Droplet,
  'Thermometer': Thermometer,
  'Zap': Zap,
  'Bug': Bug,
  'Scissors': Scissors,
  'Trash2': Trash2,
  'Shield': Shield,
  'Wrench': Wrench,
};

const Home = () => {
  const getIconComponent = (iconName: string) => {
    const Icon = iconMap[iconName as keyof typeof iconMap];
    return Icon ? <Icon className="h-12 w-12" /> : null;
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Professional Maintenance Services at Your Fingertips
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              From plumbing and HVAC to pest control and security, we've got you covered with trusted professionals.
            </p>
            <div className="flex gap-4">
              <Link to="/request-service">
                <Button size="lg">Request Service</Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg">Browse Services</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {serviceCategories.map((category) => (
              <div key={category.id} className="p-6 rounded-lg border bg-card hover:shadow-lg transition-shadow">
                <div className="text-primary mb-4">
                  {getIconComponent(category.icon)}
                </div>
                <h3 className="text-xl font-semibold mb-2">{category.name}</h3>
                <p className="text-muted-foreground mb-4 min-h-[60px]">
                  {category.description}
                </p>
                <div className="text-sm text-muted-foreground mb-4">
                  <strong>Services include:</strong>
                  <ul className="list-disc list-inside mt-2">
                    {category.services.slice(0, 3).map(service => (
                      <li key={service.id} className="truncate">{service.name}</li>
                    ))}
                  </ul>
                </div>
                <Link to={`/request-service?category=${category.id}`}>
                  <Button variant="default" className="w-full">Request Service</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Schedule your service today and experience the difference of working with trusted professionals.
          </p>
          <Link to="/request-service">
            <Button size="lg">Request Service Now</Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
