import { useParams } from 'react-router-dom';
import { serviceCategories } from '@/data/serviceCategories';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import * as LucideIcons from 'lucide-react';

const ServiceCategory = () => {
  const { categoryId } = useParams();
  const category = serviceCategories.find(cat => cat.id === categoryId);

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Service Category Not Found</h1>
        <p>The requested service category could not be found.</p>
      </div>
    );
  }

  const Icon = (LucideIcons as any)[category.icon];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center space-x-4 mb-8">
        {Icon && (
          <div className="p-3 bg-primary/10 rounded-lg">
            <Icon className="h-8 w-8 text-primary" />
          </div>
        )}
        <div>
          <h1 className="text-4xl font-bold">{category.name}</h1>
          <p className="text-xl text-muted-foreground mt-2">{category.description}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {category.services.map(service => (
          <Card key={service.id} className="flex flex-col">
            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <div>
                  <strong className="text-sm">Duration:</strong>
                  <p className="text-sm text-muted-foreground">{service.estimatedDuration}</p>
                </div>
                <div>
                  <strong className="text-sm">Price Range:</strong>
                  <p className="text-sm text-muted-foreground">
                    ${service.priceRange.min} - ${service.priceRange.max}
                  </p>
                </div>
                <div>
                  <strong className="text-sm">Common Issues:</strong>
                  <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                    {service.commonIssues.slice(0, 3).map((issue, index) => (
                      <li key={index} className="truncate">{issue}</li>
                    ))}
                    {service.commonIssues.length > 3 && (
                      <li className="text-primary">+ {service.commonIssues.length - 3} more issues</li>
                    )}
                  </ul>
                </div>
              </div>
              <Button className="w-full mt-6" variant="default">
                Request This Service
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServiceCategory;
