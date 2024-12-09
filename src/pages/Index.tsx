import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as LucideIcons from "lucide-react";
import { CategorySelector } from "@/components/CategorySelector";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { categories } from "@/data/maintenanceData";
import { Navigation } from "@/components/Navigation";

const categoryIcons: Record<string, any> = {
  electrical: LucideIcons.Zap,
  plumbing: LucideIcons.Droplet,
  hvac: LucideIcons.Thermometer,
  roofing: LucideIcons.Home,
  "pest-control": LucideIcons.Bug,
  appliances: LucideIcons.Radio,
  carpentry: LucideIcons.Hammer,
  flooring: LucideIcons.Construction,
  painting: LucideIcons.PaintBucket,
  landscaping: LucideIcons.Trees,
  security: LucideIcons.Shield,
  cleaning: LucideIcons.Wind
}

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const maintenanceCategories = [
    {
      title: "Residential Plumbing",
      icon: LucideIcons.Droplet,
      description: "Home plumbing repairs and maintenance",
      path: "/service/plumbing"
    },
    {
      title: "Residential HVAC",
      icon: LucideIcons.Thermometer,
      description: "Home heating and cooling services",
      path: "/service/hvac"
    },
    {
      title: "Residential Electrical",
      icon: LucideIcons.Zap,
      description: "Home electrical services",
      path: "/service/electrical"
    },
    {
      title: "Residential Appliances",
      icon: LucideIcons.Settings2,
      description: "Home appliance repair and maintenance",
      path: "/service/appliances"
    },
    {
      title: "Residential Roofing",
      icon: LucideIcons.Home,
      description: "Home roofing repairs and maintenance",
      path: "/service/roofing"
    },
    {
      title: "Residential Landscaping",
      icon: LucideIcons.TreePine,
      description: "Home landscaping services",
      path: "/service/landscaping"
    },
    {
      title: "Residential Windows/Doors",
      icon: LucideIcons.Store,
      description: "Home window and door installation and repair",
      path: "/service/windows-doors"
    },
    {
      title: "Residential Painting",
      icon: LucideIcons.Paintbrush,
      description: "Home painting services",
      path: "/service/painting"
    },
    {
      title: "Residential Pest Control",
      icon: LucideIcons.Bug,
      description: "Home pest control services",
      path: "/service/pest-control"
    },
    {
      title: "Residential Fire Safety",
      icon: LucideIcons.Bell,
      description: "Home fire safety services",
      path: "/service/fire-safety"
    },
    {
      title: "Residential Security",
      icon: LucideIcons.Shield,
      description: "Home security services",
      path: "/service/security"
    }
  ];

  const commercialCategories = [
    {
      title: "Commercial Plumbing",
      icon: LucideIcons.Wrench,
      description: "Commercial plumbing services",
      path: "/service/commercial/plumbing"
    },
    {
      title: "Commercial HVAC",
      icon: LucideIcons.Thermometer,
      description: "Commercial HVAC services",
      path: "/service/commercial/hvac"
    },
    {
      title: "Commercial Electrical",
      icon: LucideIcons.Zap,
      description: "Commercial electrical services",
      path: "/service/commercial/electrical"
    },
    {
      title: "Commercial Construction",
      icon: LucideIcons.Building2,
      description: "Commercial construction services",
      path: "/service/commercial/construction"
    },
    {
      title: "Commercial Security",
      icon: LucideIcons.Shield,
      description: "Commercial security services",
      path: "/service/commercial/security"
    },
    {
      title: "Commercial Pest Control",
      icon: LucideIcons.Bug,
      description: "Commercial pest control services",
      path: "/service/commercial/pest-control"
    },
    {
      title: "Commercial Fire Safety",
      icon: LucideIcons.Bell,
      description: "Commercial fire safety services",
      path: "/service/commercial/fire-safety"
    },
    {
      title: "Commercial Kitchen",
      icon: LucideIcons.ChefHat,
      description: "Commercial kitchen services",
      path: "/service/commercial/kitchen"
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
              <LucideIcons.Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
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

        <div className="container py-8">
          <div className="flex flex-col items-center text-center mb-8">
            <h1 className="text-4xl font-bold tracking-tight">Maintenance Services</h1>
            <p className="text-lg text-muted-foreground mt-2">
              Professional maintenance and repair services for your home and business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const Icon = categoryIcons[category]
              return (
                <Card key={category} className="group hover:shadow-lg transition-shadow">
                  <Link to={`/service/${category}`}>
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        {Icon && <Icon className="h-5 w-5" />}
                        <CardTitle className="capitalize">
                          {category.replace("-", " ")}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription>
                        Click to view available services
                      </CardDescription>
                    </CardContent>
                  </Link>
                </Card>
              )
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
