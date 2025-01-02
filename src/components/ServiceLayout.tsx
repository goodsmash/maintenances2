import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Service } from '@/data/servicesData';

interface ServiceLayoutProps {
  serviceType: string;
  services: Service[];
  translationNamespace: string;
}

const ServiceLayout: React.FC<ServiceLayoutProps> = ({
  serviceType,
  services,
  translationNamespace
}) => {
  const { translate, language, setLanguage } = useLanguage();

  const languageOptions = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'zh', name: '中文' }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">
            {translate('title', translationNamespace)}
          </h1>
          <p className="text-muted-foreground mt-2">
            {translate('subtitle', translationNamespace)}
          </p>
        </div>
        <div className="flex space-x-2">
          {languageOptions.map((lang) => (
            <Button
              key={lang.code}
              variant={language === lang.code ? 'default' : 'outline'}
              onClick={() => setLanguage(lang.code as 'en' | 'es' | 'zh')}
              size="sm"
            >
              {lang.name}
            </Button>
          ))}
        </div>
      </div>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service) => (
          <Link 
            to={`/service/${serviceType}/${service.id}`} 
            key={service.id}
            className="hover:no-underline"
          >
            <Card className="hover:shadow-lg transition-all duration-300 h-full">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <CardTitle>{service.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{service.shortDescription}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-primary font-bold">
                    {service.priceRange}
                  </span>
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
        <h2 className="text-3xl font-bold mb-6">
          {translate('whyChooseUs.title', translationNamespace)}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {translate('whyChooseUs.benefits', translationNamespace).map((benefit: any, index: number) => (
            <div key={index} className="p-6 bg-card rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
              <p className="text-muted-foreground">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceLayout;
