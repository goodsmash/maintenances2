import { Navigation } from "@/components/Navigation";
import { MaintenanceCard } from "@/components/MaintenanceCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Wrench, 
  Building2, 
  Home, 
  Settings2, 
  Zap, 
  PenLine, 
  Thermometer, 
  Hammer, 
  Shield, 
  Bug, 
  Bell, 
  Lock, 
  ChefHat,
  Droplet,
  TreePine,
  Paintbrush,
  Store
} from "lucide-react";
import { useState } from "react";
import { CategorySelector } from "@/components/CategorySelector";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from 'react-router-dom';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const maintenanceCategories = [
    {
      title: "Residential Plumbing",
      icon: Droplet,
      description: "Home plumbing repairs and maintenance",
      path: "/service/plumbing"
    },
    {
      title: "Residential HVAC",
      icon: Thermometer,
      description: "Home heating and cooling services",
      path: "/service/hvac"
    },
    {
      title: "Residential Electrical",
      icon: Zap,
      description: "Home electrical services",
      path: "/service/electrical"
    },
    {
      title: "Residential Appliances",
      icon: Settings2,
      description: "Home appliance repair and maintenance",
      path: "/service/appliances"
    },
    {
      title: "Residential Roofing",
      icon: Home,
      description: "Home roofing repairs and maintenance",
      path: "/service/roofing"
    },
    {
      title: "Residential Landscaping",
      icon: TreePine,
      description: "Home landscaping services",
      path: "/service/landscaping"
    },
    {
      title: "Residential Windows/Doors",
      icon: Store,
      description: "Home window and door installation and repair",
      path: "/service/windows-doors"
    },
    {
      title: "Residential Painting",
      icon: Paintbrush,
      description: "Home painting services",
      path: "/service/painting"
    },
    {
      title: "Residential Pest Control",
      icon: Bug,
      description: "Home pest control services",
      path: "/service/pest-control"
    },
    {
      title: "Residential Fire Safety",
      icon: Bell,
      description: "Home fire safety services",
      path: "/service/fire-safety"
    },
    {
      title: "Residential Security",
      icon: Shield,
      description: "Home security services",
      path: "/service/security"
    }
  ];

  const commercialCategories = [
    {
      title: "Commercial Plumbing",
      icon: Wrench,
      description: "Commercial plumbing services",
      path: "/commercial/plumbing"
    },
    {
      title: "Commercial HVAC",
      icon: Thermometer,
      description: "Commercial HVAC services",
      path: "/commercial/hvac"
    },
    {
      title: "Commercial Electrical",
      icon: Zap,
      description: "Commercial electrical services",
      path: "/commercial/electrical"
    },
    {
      title: "Commercial Construction",
      icon: Building2,
      description: "Commercial construction services",
      path: "/commercial/construction"
    },
    {
      title: "Commercial Security",
      icon: Shield,
      description: "Commercial security services",
      path: "/commercial/security"
    },
    {
      title: "Commercial Pest Control",
      icon: Bug,
      description: "Commercial pest control services",
      path: "/commercial/pest-control"
    },
    {
      title: "Commercial Fire Safety",
      icon: Bell,
      description: "Commercial fire safety services",
      path: "/commercial/fire-safety"
    },
    {
      title: "Commercial Kitchen",
      icon: ChefHat,
      description: "Commercial kitchen services",
      path: "/commercial/kitchen"
    }
  ];

  const maintenanceRequests = [
    {
      title: "Commercial Kitchen Grease Trap Cleaning",
      location: "Los Angeles, CA",
      category: "Restaurant Equipment",
      urgency: "High",
      postedTime: "2 hours ago"
    },
    {
      title: "HVAC System Annual Maintenance",
      location: "San Francisco, CA",
      category: "Commercial HVAC",
      urgency: "Medium",
      postedTime: "5 hours ago"
    },
    {
      title: "Electrical Panel Inspection",
      location: "San Diego, CA",
      category: "Electrical",
      urgency: "Low",
      postedTime: "1 day ago"
    },
    {
      title: "Fire Suppression System Check",
      location: "Sacramento, CA",
      category: "Fire Safety Systems",
      urgency: "High",
      postedTime: "3 hours ago"
    },
    {
      title: "Plumbing System Maintenance",
      location: "Oakland, CA",
      category: "Industrial Plumbing",
      urgency: "Medium",
      postedTime: "6 hours ago"
    }
  ] as const;

  const filteredRequests = maintenanceRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         request.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || request.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Maintenance Services</h1>
          <Button variant="outline">Post a Job</Button>
        </div>

        <div className="flex gap-4 mb-8">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search services..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <CategorySelector
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Residential Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {maintenanceCategories.map((category) => (
              <Link key={category.title} to={category.path}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <category.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{category.title}</h3>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-6">Commercial Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {commercialCategories.map((category) => (
              <Link key={category.title} to={category.path}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <category.icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{category.title}</h3>
                        <p className="text-sm text-gray-600">{category.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </section>

        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Why Choose Us?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Professional Service</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Licensed and insured contractors for both residential and commercial needs</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>24/7 Emergency Service</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Round-the-clock support for urgent maintenance issues</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Industry Compliance</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Meeting all health, safety, and industry regulations</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
