import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { applianceServices } from "@/data/applianceServicesData";
import { LeadForm } from "@/components/LeadForm";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const ApplianceServices: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12">
        Comprehensive Appliance Repair Services
      </h1>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {applianceServices.map((service) => (
          <Card key={service.id} className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <div className="flex items-center space-x-4">
                <service.icon className="w-12 h-12 text-primary" />
                <CardTitle>{service.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">{service.description}</p>
              
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Key Benefits:</h3>
                <ul className="list-disc list-inside text-sm">
                  {service.keyBenefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Repair Types:</h3>
                <ul className="list-disc list-inside text-sm">
                  {service.repairTypes.map((type, index) => (
                    <li key={index}>{type}</li>
                  ))}
                </ul>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-primary font-bold">{service.priceRange}</span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">Request Service</Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <LeadForm 
                      initialService={service.name} 
                      title={`Book ${service.name}`} 
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold mb-6">Why Choose Our Appliance Repair?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-4">Expert Technicians</h3>
            <p>Certified professionals with years of experience in appliance repair.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Rapid Response</h3>
            <p>Same-day and emergency services available for urgent repairs.</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-4">Warranty Guaranteed</h3>
            <p>90-day warranty on all parts and labor for complete peace of mind.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplianceServices;
