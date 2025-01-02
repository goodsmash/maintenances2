import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { LeadForm } from '../components/LeadForm';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Clock, DollarSign, Wrench, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { maintenanceData, severityColors } from '@/data/maintenanceData';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { maintenanceCategories } from '@/data/maintenanceCategories';
import { serviceCategories } from '@/data/serviceCategories';

export default function ServicePage() {
  const { serviceId } = useParams<{ serviceId: string }>();
  const navigate = useNavigate();
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);

  // Try to find the service in both maintenance and regular service categories
  const maintenanceCategory = maintenanceCategories.find(cat => 
    cat.id === serviceId || cat.subCategories.some(sub => sub.id === serviceId)
  );
  
  const serviceCategory = serviceCategories.find(cat => cat.id === serviceId);
  
  const maintenanceServiceData = serviceId && maintenanceData[serviceId];

  if (!serviceId || (!maintenanceCategory && !serviceCategory && !maintenanceServiceData)) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertTitle>Service Not Found</AlertTitle>
          <AlertDescription>The service "{serviceId}" does not exist</AlertDescription>
        </Alert>
        <Link to="/">
          <Button className="mt-4">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Return Home
          </Button>
        </Link>
      </div>
    );
  }

  // Render maintenance category view
  if (maintenanceCategory) {
    const subCategory = maintenanceCategory.subCategories.find(sub => sub.id === serviceId);
    const services = subCategory ? subCategory.services : maintenanceCategory.subCategories[0].services;
    const title = subCategory ? subCategory.name : maintenanceCategory.name;
    const description = subCategory ? subCategory.description : maintenanceCategory.description;

    return (
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card key={service.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{service.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{service.description}</CardDescription>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>{service.estimatedDuration}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <DollarSign className="mr-2 h-4 w-4" />
                    <span>${service.priceRange.min} - ${service.priceRange.max}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Wrench className="mr-2 h-4 w-4" />
                    <span>{service.expertise.join(", ")}</span>
                  </div>

                  <Button
                    onClick={() => {
                      setSelectedIssue(service.name);
                      setShowLeadForm(true);
                    }}
                    className="w-full mt-4"
                  >
                    Schedule Service
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Render service category view
  if (serviceCategory) {
    return (
      <div className="container py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/">
            <Button variant="outline">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">{serviceCategory.name}</h1>
            <p className="text-muted-foreground">{serviceCategory.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {serviceCategory.services.map((service) => (
            <Card key={service.id} className="group hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{service.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">{service.description}</CardDescription>
                
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Clock className="mr-2 h-4 w-4" />
                    <span>{service.estimatedDuration}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <DollarSign className="mr-2 h-4 w-4" />
                    <span>${service.priceRange.min} - ${service.priceRange.max}</span>
                  </div>

                  {service.urgencyLevels.map((level) => (
                    <Badge 
                      key={level.id}
                      variant={level.id === 'urgent' ? 'destructive' : 'secondary'}
                      className="mr-2"
                    >
                      {level.name}
                    </Badge>
                  ))}

                  <Button
                    onClick={() => {
                      setSelectedIssue(service.name);
                      setShowLeadForm(true);
                    }}
                    className="w-full mt-4"
                  >
                    Request Service
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Render maintenance data view (legacy)
  const { description, issues } = maintenanceServiceData;
  return (
    <div className="container py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link to="/">
          <Button variant="outline">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold capitalize">{serviceId.replace("-", " ")} Services</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {issues.map((issue) => (
          <Card key={issue.title} className="group hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <CardTitle className="text-lg">{issue.title}</CardTitle>
                <Badge className={severityColors[issue.severity]}>
                  {issue.severity}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">{issue.description}</CardDescription>
              
              <div className="space-y-3">
                <div>
                  <strong className="text-sm">Common Symptoms:</strong>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {issue.symptoms.map((symptom) => (
                      <li key={symptom}>{symptom}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="flex items-center text-sm">
                  <DollarSign className="mr-2 h-4 w-4" />
                  <span>{issue.estimatedCost}</span>
                </div>
                
                <div className="flex items-center text-sm">
                  <Clock className="mr-2 h-4 w-4" />
                  <span>{issue.timeToFix}</span>
                </div>
                
                <Button
                  onClick={() => {
                    setSelectedIssue(issue.title);
                    setShowLeadForm(true);
                  }}
                  className="w-full mt-4"
                >
                  Request Service
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showLeadForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-lg">
            <CardHeader>
              <CardTitle>Request Service</CardTitle>
              <CardDescription>
                {selectedIssue ? `Service requested: ${selectedIssue}` : 'Fill out the form below'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LeadForm 
                onSubmit={() => setShowLeadForm(false)}
                onCancel={() => setShowLeadForm(false)}
                serviceType={selectedIssue || ''}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
