import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { LeadForm } from '../components/LeadForm';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { ChevronLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { maintenanceData, severityColors } from '../data/maintenanceData';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function ServicePage() {
  const { category } = useParams<{ category: string }>();
  const navigate = useNavigate();
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [showLeadForm, setShowLeadForm] = useState(false);

  if (!category || !maintenanceData[category]) {
    return (
      <div className="container py-8">
        <Alert variant="destructive">
          <AlertTitle>Category Not Found</AlertTitle>
          <AlertDescription>The category "{category}" does not exist</AlertDescription>
        </Alert>
        <Link to="/">
          <Button>
            <ChevronLeft className="mr-2 h-4 w-4" />
            Return Home
          </Button>
        </Link>
      </div>
    )
  }

  const { description, issues } = maintenanceData[category]

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
          <h1 className="text-3xl font-bold capitalize">{category.replace("-", " ")} Services</h1>
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
              
              <div className="space-y-2">
                <div>
                  <strong className="text-sm">Common Symptoms:</strong>
                  <ul className="list-disc list-inside text-sm text-muted-foreground">
                    {issue.symptoms.map((symptom) => (
                      <li key={symptom}>{symptom}</li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <strong className="text-sm">Estimated Cost:</strong>
                  <span className="ml-2 text-sm text-muted-foreground">{issue.estimatedCost}</span>
                </div>
                
                <div>
                  <strong className="text-sm">Time to Fix:</strong>
                  <span className="ml-2 text-sm text-muted-foreground">{issue.timeToFix}</span>
                </div>
                
                <Button
                  onClick={() => {
                    setSelectedIssue(issue.title);
                    setShowLeadForm(true);
                  }}
                  className="w-full"
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
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Submit Service Request</h2>
              <button
                onClick={() => setShowLeadForm(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <LeadForm
                category={category}
                service={selectedIssue || ''}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
