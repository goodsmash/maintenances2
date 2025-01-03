import React from "react";
import { Link } from "react-router-dom";
import { contractorServices } from "@/data/contractorServicesData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";

const ContractorServices: React.FC = () => {
  const { translate, language, setLanguage } = useLanguage();

  const languageOptions = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'zh', name: '中文' }
  ];

  const services = translate('services', 'contractorServices');
  const benefits = translate('whyChooseUs.benefits', 'contractorServices');

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">
            {translate('title', 'contractorServices')}
          </h1>
          <p className="text-muted-foreground mt-2">
            {translate('subtitle', 'contractorServices')}
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
        {Object.entries(services).map(([serviceKey, service]: [string, any]) => (
          <Link 
            to={`/service/contractor/${serviceKey}`} 
            key={serviceKey}
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
                    {contractorServices.find(s => s.id === serviceKey)?.priceRange}
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
          {translate('whyChooseUs.title', 'contractorServices')}
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit: any, index: number) => (
            <div key={index}>
              <h3 className="text-xl font-semibold mb-4">{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContractorServices;
