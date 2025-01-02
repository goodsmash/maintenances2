import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Icons } from '@/components/Icons';

interface ServiceCardProps {
  title: string;
  description: string;
  iconName: string;
  path: string;
  services: { id: string; name: string }[];
}

const ServiceCard: React.FC<ServiceCardProps> = ({ 
  title, 
  description, 
  iconName, 
  path, 
  services 
}) => {
  const IconComponent = Icons[iconName as keyof typeof Icons] || Icons.Wrench;

  return (
    <Link to={path} className="block hover:no-underline">
      <Card className="h-full hover:shadow-lg transition-all duration-300">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <IconComponent className="h-6 w-6 text-primary" />
            </div>
            <CardTitle className="text-xl">{title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <CardDescription className="mb-4">{description}</CardDescription>
          {services && services.length > 0 && (
            <div className="text-sm text-muted-foreground">
              <strong>Available Services:</strong>
              <ul className="list-disc list-inside mt-2">
                {services.slice(0, 3).map(service => (
                  <li key={service.id} className="truncate">{service.name}</li>
                ))}
                {services.length > 3 && (
                  <li className="text-primary">+ {services.length - 3} more services</li>
                )}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default ServiceCard;
