import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Service } from '@/data/servicesData';

interface ServiceDetailLayoutProps {
  service: Service;
  onRequestService: () => void;
}

const ServiceDetailLayout: React.FC<ServiceDetailLayoutProps> = ({
  service,
  onRequestService
}) => {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Back Navigation */}
      <Link to="/service/contractor" className="flex items-center text-primary hover:text-primary/80 mb-8">
        <ChevronLeft className="h-4 w-4 mr-1" />
        Back to Contractor Services
      </Link>

      {/* Service Header */}
      <div className="grid lg:grid-cols-2 gap-12 mb-12">
        <div>
          <h1 className="text-4xl font-bold mb-4">{service.name}</h1>
          <p className="text-xl text-muted-foreground mb-6">
            {service.longDescription}
          </p>
          <div className="flex items-center gap-4">
            <Button size="lg" onClick={onRequestService}>
              Request Service
            </Button>
            <span className="text-2xl font-semibold text-primary">
              {service.priceRange}
            </span>
          </div>
        </div>
        {service.imageUrl && (
          <div className="relative rounded-lg overflow-hidden h-[400px]">
            <img
              src={service.imageUrl}
              alt={service.name}
              className="object-cover w-full h-full"
            />
          </div>
        )}
      </div>

      {/* Features and Benefits */}
      <div className="grid md:grid-cols-2 gap-12 mb-16">
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-6">Service Features</h2>
            <ul className="space-y-4">
              {service.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <Check className="h-5 w-5 text-primary mr-3 mt-1" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <h2 className="text-2xl font-semibold mb-6">Benefits</h2>
            <ul className="space-y-4">
              {service.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <Star className="h-5 w-5 text-primary mr-3 mt-1" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Process Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-semibold mb-8">Our Process</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {[
            {
              step: 1,
              title: 'Consultation',
              description: 'We discuss your needs and provide a detailed plan'
            },
            {
              step: 2,
              title: 'Proposal',
              description: 'You receive a comprehensive quote and timeline'
            },
            {
              step: 3,
              title: 'Execution',
              description: 'Our experts complete the work to your satisfaction'
            },
            {
              step: 4,
              title: 'Follow-up',
              description: 'We ensure everything meets your expectations'
            }
          ].map((step) => (
            <div key={step.step} className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-lg font-semibold text-primary">{step.step}</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary/5 rounded-lg p-8 text-center">
        <h2 className="text-3xl font-semibold mb-4">Ready to Get Started?</h2>
        <p className="text-lg text-muted-foreground mb-6">
          Contact us today to schedule your service or get a free quote.
        </p>
        <div className="flex justify-center gap-4">
          <Button size="lg" onClick={onRequestService}>
            Request Service
          </Button>
          <Button size="lg" variant="outline">
            Get a Quote
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetailLayout;
