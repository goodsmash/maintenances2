import React from "react";
import { Link } from "react-router-dom";
import { paintingServices } from "@/data/paintingServicesData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PaintingServices: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">
        Comprehensive Painting Services
      </h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paintingServices.map((service) => (
          <Link 
            to={`/service/painting/${service.id}`} 
            key={service.id}
            className="hover:no-underline"
          >
            <Card className="hover:shadow-lg transition-all duration-300 h-full">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <service.icon className="w-12 h-12 text-primary" />
                  <CardTitle>{service.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{service.shortDescription}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-primary font-bold">{service.priceRange}</span>
                  <span className="text-sm text-primary hover:underline">
                    Learn More →
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Why Choose Our Painting Services?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Professional Quality</h3>
            <p>Expert painters with meticulous attention to detail</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Comprehensive Solutions</h3>
            <p>From residential to commercial, we cover all painting needs</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Color Expertise</h3>
            <p>Professional color consultation and design guidance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaintingServices;
