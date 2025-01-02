import React from "react";
import { useParams } from "react-router-dom";
import { applianceServices } from "@/data/applianceServicesData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/LeadForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const ApplianceServiceCategory: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  
  const service = applianceServices.find(
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
          <p className="text-muted-foreground mb-6">{service.description}</p>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Repair Types</h3>
            <div className="grid md:grid-cols-2 gap-2">
              {service.repairTypes.map((type, index) => (
                <div key={index} className="flex items-center">
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-5 w-5 text-primary mr-2" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                  {type}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Price Range</h3>
            <p className="text-primary font-bold text-lg">{service.priceRange}</p>
          </div>
        </div>
        
        <div>
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Key Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {service.keyBenefits.map((benefit, index) => (
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
          
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full" size="lg">
                Request Service
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <LeadForm 
                category="appliance"
                service={service.name}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default ApplianceServiceCategory;
