import { MaintenanceCategory } from './maintenanceCategories';

export const environmentalMaintenanceCategory: MaintenanceCategory = {
  id: "environmental",
  name: "Environmental Systems",
  description: "Maintenance services for environmental control and sustainability systems",
  icon: "leaf",
  subCategories: [
    {
      id: "water-treatment",
      name: "Water Treatment Systems",
      description: "Maintenance of water treatment and filtration systems",
      services: [
        {
          id: "water-quality-monitoring",
          name: "Water Quality Monitoring",
          description: "Regular testing and monitoring of water quality",
          estimatedDuration: "2-3 hours",
          priceRange: { min: 200, max: 500 },
          expertise: ["Water Quality Specialist"],
          materials: ["Testing Equipment", "Chemical Reagents"],
          frequency: "Monthly",
          certifications: ["Water Quality Certification"]
        },
        {
          id: "filtration-maintenance",
          name: "Filtration System Maintenance",
          description: "Maintenance of water filtration systems",
          estimatedDuration: "3-4 hours",
          priceRange: { min: 250, max: 700 },
          expertise: ["Filtration Specialist"],
          materials: ["Filters", "Replacement Parts"],
          frequency: "Quarterly"
        }
        // ... (will continue with 35+ more water treatment services)
      ]
    },
    {
      id: "air-quality",
      name: "Air Quality Systems",
      description: "Maintenance of air quality control systems",
      services: [
        {
          id: "air-filtration",
          name: "Air Filtration System Maintenance",
          description: "Maintenance of commercial air filtration systems",
          estimatedDuration: "2-4 hours",
          priceRange: { min: 200, max: 600 },
          expertise: ["Air Quality Technician"],
          materials: ["Air Filters", "Testing Equipment"],
          frequency: "Monthly"
        }
        // ... (will continue with 30+ more air quality services)
      ]
    },
    {
      id: "waste-management",
      name: "Waste Management Systems",
      description: "Maintenance of waste handling and processing systems",
      services: [
        {
          id: "compactor-maintenance",
          name: "Waste Compactor Maintenance",
          description: "Maintenance of industrial waste compactors",
          estimatedDuration: "3-5 hours",
          priceRange: { min: 300, max: 800 },
          expertise: ["Waste Equipment Technician"],
          materials: ["Hydraulic Parts", "Mechanical Components"],
          frequency: "Monthly"
        }
        // ... (will continue with 25+ more waste management services)
      ]
    }
    // ... (will add more environmental subcategories)
  ]
};
