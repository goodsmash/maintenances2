import React from 'react';
import { Check, ChevronRight } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { maintenanceData } from '../data/maintenanceData';
import { commercialMaintenanceData } from '../data/commercialMaintenanceData';

interface Category {
  id: string;
  name: string;
  description: string;
  subcategories: {
    id: string;
    name: string;
    description: string;
  }[];
}

const categories: Category[] = [
  {
    id: "residential",
    name: "Residential Services",
    description: "Home maintenance and repair services",
    subcategories: [
      {
        id: "plumbing",
        name: "Plumbing",
        description: "Water, drainage, and pipe services"
      },
      {
        id: "hvac",
        name: "HVAC",
        description: "Heating, cooling, and ventilation"
      },
      {
        id: "electrical",
        name: "Electrical",
        description: "Power, lighting, and wiring"
      }
      // Add more residential subcategories
    ]
  },
  {
    id: "commercial",
    name: "Commercial Services",
    description: "Business and commercial property maintenance",
    subcategories: [
      {
        id: "restaurantPlumbing",
        name: "Restaurant Plumbing",
        description: "Commercial kitchen and food service plumbing"
      },
      {
        id: "commercialHVAC",
        name: "Commercial HVAC",
        description: "Industrial climate control systems"
      },
      {
        id: "commercialAppliances",
        name: "Commercial Appliances",
        description: "Professional kitchen equipment"
      }
      // Add more commercial subcategories
    ]
  },
  {
    id: "specialized",
    name: "Specialized Services",
    description: "Industry-specific maintenance solutions",
    subcategories: [
      {
        id: "foodService",
        name: "Food Service",
        description: "Restaurant and food preparation equipment"
      },
      {
        id: "retail",
        name: "Retail",
        description: "Store and shop maintenance"
      },
      {
        id: "medical",
        name: "Medical Facilities",
        description: "Healthcare facility maintenance"
      }
      // Add more specialized subcategories
    ]
  }
];

interface DetailedCategorySelectorProps {
  onCategorySelect: (category: string, subcategory: string) => void;
  selectedCategory?: string;
  selectedSubcategory?: string;
}

export function DetailedCategorySelector({
  onCategorySelect,
  selectedCategory,
  selectedSubcategory
}: DetailedCategorySelectorProps) {
  const [mainCategory, setMainCategory] = React.useState<string | null>(null);
  const [showSubcategories, setShowSubcategories] = React.useState(false);

  const handleMainCategorySelect = (categoryId: string) => {
    setMainCategory(categoryId);
    setShowSubcategories(true);
  };

  const handleSubcategorySelect = (categoryId: string, subcategoryId: string) => {
    onCategorySelect(categoryId, subcategoryId);
  };

  return (
    <div className="space-y-4">
      {!showSubcategories ? (
        <>
          <h3 className="text-lg font-semibold mb-4">Select Service Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                className={`cursor-pointer hover:shadow-md transition-shadow ${
                  mainCategory === category.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleMainCategorySelect(category.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{category.name}</h4>
                      <p className="text-sm text-gray-500">{category.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Select Specific Service</h3>
            <Button
              variant="ghost"
              onClick={() => setShowSubcategories(false)}
            >
              Back to Categories
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories
              .find(c => c.id === mainCategory)
              ?.subcategories.map((subcategory) => (
                <Card
                  key={subcategory.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${
                    selectedSubcategory === subcategory.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleSubcategorySelect(mainCategory!, subcategory.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{subcategory.name}</h4>
                        <p className="text-sm text-gray-500">{subcategory.description}</p>
                      </div>
                      {selectedSubcategory === subcategory.id && (
                        <Check className="h-5 w-5 text-primary" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </>
      )}
    </div>
  );
}
