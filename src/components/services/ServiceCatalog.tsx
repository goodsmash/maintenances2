import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { serviceCategories, ServiceCategory, Service, UrgencyLevel } from '@/data/serviceCategories';
import * as Icons from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  category: ServiceCategory;
  onRequestService: (service: Service, category: ServiceCategory) => void;
}

function ServiceCard({ service, category, onRequestService }: ServiceCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={`relative transition-shadow duration-300 ${
        isHovered ? 'shadow-lg' : 'shadow'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardHeader>
        <CardTitle className="text-lg">{service.name}</CardTitle>
        <CardDescription>{service.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Duration:</span>
            <span>{service.estimatedDuration}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Price Range:</span>
            <span>
              ${service.priceRange.min} - ${service.priceRange.max}
            </span>
          </div>
          <div className="space-y-2">
            <span className="text-sm text-gray-500">Common Issues:</span>
            <div className="flex flex-wrap gap-2">
              {service.commonIssues.map((issue) => (
                <Badge key={issue} variant="secondary">
                  {issue}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          className="w-full"
          onClick={() => onRequestService(service, category)}
        >
          Request Service
        </Button>
      </CardFooter>
    </Card>
  );
}

interface CategorySectionProps {
  category: ServiceCategory;
  onRequestService: (service: Service, category: ServiceCategory) => void;
}

function CategorySection({ category, onRequestService }: CategorySectionProps) {
  const Icon = Icons[category.icon as keyof typeof Icons];

  return (
    <section className="space-y-6">
      <div className="flex items-center gap-3">
        <Icon className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">{category.name}</h2>
      </div>
      <p className="text-gray-500">{category.description}</p>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {category.services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            category={category}
            onRequestService={onRequestService}
          />
        ))}
      </div>
    </section>
  );
}

export function ServiceCatalog() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');

  const filteredCategories = serviceCategories.filter((category) => {
    if (selectedCategory !== 'all' && category.id !== selectedCategory) {
      return false;
    }

    const searchLower = searchQuery.toLowerCase();
    const categoryMatches = category.name.toLowerCase().includes(searchLower) ||
      category.description.toLowerCase().includes(searchLower);

    const serviceMatches = category.services.some(
      (service) =>
        service.name.toLowerCase().includes(searchLower) ||
        service.description.toLowerCase().includes(searchLower) ||
        service.commonIssues.some((issue) =>
          issue.toLowerCase().includes(searchLower)
        )
    );

    return categoryMatches || serviceMatches;
  });

  const handleRequestService = (service: Service, category: ServiceCategory) => {
    navigate(`/service-request`, {
      state: {
        serviceId: service.id,
        categoryId: category.id,
        urgency: selectedUrgency,
      },
    });
  };

  return (
    <div className="space-y-8">
      {/* Search and Filter Section */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 p-4 border-b">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search services, issues, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {serviceCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedUrgency}
              onValueChange={setSelectedUrgency}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select urgency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Urgency</SelectItem>
                {serviceCategories[0].services[0].urgencyLevels.map((level) => (
                  <SelectItem key={level.id} value={level.id}>
                    {level.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Service Categories */}
      <div className="max-w-7xl mx-auto px-4">
        <AnimatePresence mode="wait">
          {filteredCategories.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12"
            >
              <p className="text-gray-500">
                No services found matching your search criteria
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {filteredCategories.map((category) => (
                <CategorySection
                  key={category.id}
                  category={category}
                  onRequestService={handleRequestService}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Help Section */}
      <div className="bg-muted py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold">Need Immediate Assistance?</h3>
            <p className="text-gray-500">
              Our support team is available 24/7 to help you with urgent issues
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg" variant="default">
                Call Emergency Support
              </Button>
              <Button size="lg" variant="outline">
                Start Live Chat
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
