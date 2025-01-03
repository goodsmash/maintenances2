import React from "react";
import { Link } from "react-router-dom";
import { commercialServiceCategories } from "@/data/commercialServiceCategoriesData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { LeadForm } from "@/components/LeadForm";

const CommercialServices: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">
        Comprehensive Commercial Maintenance Solutions
      </h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {commercialServiceCategories.map((service) => (
          <Link 
            to={`/service/commercial/${service.id}`} 
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
        <h2 className="text-3xl font-bold mb-6">Why Choose Our Commercial Services?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Professional Service</h3>
            <p>Licensed and insured contractors for both residential and commercial needs</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">24/7 Emergency Service</h3>
            <p>Round-the-clock support for urgent maintenance issues</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Industry Compliance</h3>
            <p>Meeting all health, safety, and industry regulations</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommercialServices;
