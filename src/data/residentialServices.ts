import { MaintenanceCategory } from './maintenanceCategories';

export const residentialMaintenanceCategory: MaintenanceCategory = {
  id: "residential",
  name: "Residential Maintenance",
  description: "Comprehensive maintenance services for residential properties",
  icon: "home",
  subCategories: [
    {
      id: "plumbing",
      name: "Plumbing Services",
      description: "Complete plumbing maintenance and repair services",
      services: [
        {
          id: "pipe-repair",
          name: "Pipe Repair and Replacement",
          description: "Professional repair or replacement of damaged pipes",
          estimatedDuration: "2-4 hours",
          priceRange: { min: 150, max: 500 },
          expertise: ["Licensed Plumber", "Pipe Fitting Specialist"],
          materials: ["Copper Pipes", "PVC Pipes", "Pipe Fittings", "Solder"],
          frequency: "As needed",
          certifications: ["State Plumbing License"]
        },
        {
          id: "drain-cleaning",
          name: "Drain Cleaning",
          description: "Professional cleaning of clogged drains",
          estimatedDuration: "1-3 hours",
          priceRange: { min: 100, max: 300 },
          expertise: ["Plumber", "Drain Cleaning Specialist"],
          materials: ["Drain Snake", "Chemical Cleaners", "Hydro Jet"],
          frequency: "As needed"
        },
        {
          id: "water-heater-maintenance",
          name: "Water Heater Maintenance",
          description: "Inspection and maintenance of water heating systems",
          estimatedDuration: "2-3 hours",
          priceRange: { min: 120, max: 400 },
          expertise: ["Plumber", "Water Heater Specialist"],
          materials: ["Replacement Parts", "Testing Equipment"],
          frequency: "Annual"
        }
        // ... (will continue with 30+ more plumbing services)
      ]
    },
    {
      id: "hvac",
      name: "HVAC Services",
      description: "Heating, ventilation, and air conditioning maintenance",
      services: [
        {
          id: "ac-maintenance",
          name: "AC System Maintenance",
          description: "Comprehensive air conditioning system maintenance",
          estimatedDuration: "2-3 hours",
          priceRange: { min: 120, max: 300 },
          expertise: ["HVAC Technician"],
          materials: ["Filters", "Refrigerant", "Cleaning Supplies"],
          frequency: "Bi-annual",
          certifications: ["EPA 608 Certification"]
        },
        {
          id: "heating-system-maintenance",
          name: "Heating System Maintenance",
          description: "Inspection and maintenance of heating systems",
          estimatedDuration: "2-4 hours",
          priceRange: { min: 150, max: 400 },
          expertise: ["HVAC Technician", "Heating Specialist"],
          materials: ["Filters", "Replacement Parts", "Testing Equipment"],
          frequency: "Annual"
        }
        // ... (will continue with 25+ more HVAC services)
      ]
    },
    {
      id: "electrical",
      name: "Electrical Services",
      description: "Residential electrical system maintenance and repairs",
      services: [
        {
          id: "electrical-inspection",
          name: "Electrical System Inspection",
          description: "Comprehensive inspection of residential electrical systems",
          estimatedDuration: "2-3 hours",
          priceRange: { min: 150, max: 400 },
          expertise: ["Licensed Electrician"],
          materials: ["Testing Equipment", "Safety Gear"],
          frequency: "Annual",
          certifications: ["Electrical License"]
        }
        // ... (will continue with 25+ more electrical services)
      ]
    },
    {
      id: "structural",
      name: "Structural Maintenance",
      description: "Maintenance of building structure and components",
      services: [
        {
          id: "roof-inspection",
          name: "Roof Inspection and Maintenance",
          description: "Comprehensive roof inspection and maintenance service",
          estimatedDuration: "3-5 hours",
          priceRange: { min: 200, max: 600 },
          expertise: ["Roofing Specialist"],
          materials: ["Roofing Materials", "Safety Equipment"],
          frequency: "Annual"
        }
        // ... (will continue with 20+ more structural services)
      ]
    }
    // ... (will add more subcategories)
  ]
};
