import React from "react";
import { useParams } from "react-router-dom";
import { commercialServiceCategories } from "@/data/commercialServiceCategoriesData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/LeadForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const CommercialServiceCategory: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  
  const service = commercialServiceCategories.find(
    (service) => service.id === category
  );

  if (!service) {
    return <div className="container mx-auto p-6">Service not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center mb-12">
        <service.icon className="w-16 h-16 text-primary mr-6" />
        <h1 className="text-4xl font-bold">{service.name}</h1>
      </div>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Service Overview</h2>
          <p className="text-muted-foreground mb-6">{service.fullDescription}</p>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Key Services</h3>
            <ul className="list-disc list-inside space-y-2">
              {service.keyServices.map((serv, index) => (
                <li key={index} className="text-muted-foreground">
                  {serv}
                </li>
              ))}
            </ul>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Price Range</h3>
            <p className="text-primary font-bold text-lg">{service.priceRange}</p>
          </div>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Benefits of Our Service</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {service.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5 text-green-500 mr-3" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Industries We Serve</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {service.industries.map((industry, index) => (
                  <span 
                    key={index} 
                    className="bg-primary/10 text-primary text-sm px-3 py-1 rounded"
                  >
                    {industry}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
          
          <div className="mt-6">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full">
                  Request {service.name} Service
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <LeadForm 
                  initialService={service.name} 
                  title={`Book ${service.name}`} 
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommercialServiceCategory;
