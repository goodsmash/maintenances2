import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  AlertTriangle,
  Clock,
  DollarSign,
  Tool,
  CheckCircle,
  Calendar,
  AlertOctagon,
  Info
} from "lucide-react";
import type { MaintenanceIssue } from '../data/maintenanceIssues';

interface DetailedIssueViewProps {
  issue: MaintenanceIssue;
}

export function DetailedIssueView({ issue }: DetailedIssueViewProps) {
  const getSeverityColor = (severity: MaintenanceIssue['severity']) => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'emergency':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeasonColor = (season: string) => {
    switch (season) {
      case 'spring':
        return 'bg-green-100 text-green-800';
      case 'summer':
        return 'bg-yellow-100 text-yellow-800';
      case 'fall':
        return 'bg-orange-100 text-orange-800';
      case 'winter':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{issue.title}</CardTitle>
          <Badge className={getSeverityColor(issue.severity)}>
            {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-gray-600 flex items-center">
            <Info className="h-4 w-4 mr-2" />
            {issue.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span>Estimated Time: {issue.estimatedTime}</span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span>Estimated Cost: {issue.estimatedCost}</span>
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-2 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2 text-yellow-500" />
            Common Causes
          </h4>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            {issue.commonCauses.map((cause, index) => (
              <li key={index}>{cause}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium mb-2 flex items-center">
            <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
            Preventive Measures
          </h4>
          <ul className="list-disc list-inside space-y-1 text-gray-600">
            {issue.preventiveMeasures.map((measure, index) => (
              <li key={index}>{measure}</li>
            ))}
          </ul>
        </div>

        {issue.requiredTools && (
          <div>
            <h4 className="font-medium mb-2 flex items-center">
              <Tool className="h-4 w-4 mr-2 text-gray-500" />
              Required Tools
            </h4>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              {issue.requiredTools.map((tool, index) => (
                <li key={index}>{tool}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <AlertOctagon className="h-4 w-4 mr-2 text-red-500" />
            <span>
              {issue.professionalRequired
                ? "Professional service required"
                : "DIY possible with proper tools"}
            </span>
          </div>

          {issue.seasonalRelevance && (
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <div className="flex space-x-2">
                {issue.seasonalRelevance.map((season) => (
                  <Badge key={season} className={getSeasonColor(season)}>
                    {season}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
