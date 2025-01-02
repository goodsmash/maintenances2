export interface MaintenanceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  subCategories: SubCategory[];
}

export interface SubCategory {
  id: string;
  name: string;
  description: string;
  services: Service[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  estimatedDuration: string;
  priceRange: {
    min: number;
    max: number;
  };
  expertise: string[];
  materials: string[];
  frequency: string;
  compliance?: string[];
  certifications?: string[];
}

export const maintenanceCategories: MaintenanceCategory[] = [
  {
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
          // Add 20+ more plumbing services
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
          // Add 20+ more HVAC services
        ]
      },
      // Add more residential subcategories
    ]
  },
  {
    id: "commercial",
    name: "Commercial Maintenance",
    description: "Professional maintenance services for commercial properties",
    icon: "building",
    subCategories: [
      {
        id: "electrical",
        name: "Electrical Systems",
        description: "Commercial electrical system maintenance and repairs",
        services: [
          {
            id: "electrical-inspection",
            name: "Electrical System Inspection",
            description: "Comprehensive inspection of commercial electrical systems",
            estimatedDuration: "4-6 hours",
            priceRange: { min: 300, max: 800 },
            expertise: ["Master Electrician"],
            materials: ["Testing Equipment", "Safety Gear"],
            frequency: "Annual",
            compliance: ["NEC Standards", "OSHA Requirements"],
            certifications: ["Master Electrician License"]
          },
          // Add 20+ more electrical services
        ]
      },
      // Add more commercial subcategories
    ]
  }
  // This is just the initial structure, we'll expand with more categories
];
