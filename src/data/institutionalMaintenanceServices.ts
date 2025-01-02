import { MaintenanceCategory } from './maintenanceCategories';

export const institutionalMaintenanceCategory: MaintenanceCategory = {
  id: "institutional",
  name: "Institutional Maintenance",
  description: "Specialized maintenance services for schools, hospitals, and other institutions",
  icon: "building-columns",
  subCategories: [
    {
      id: "medical-facilities",
      name: "Medical Facility Maintenance",
      description: "Specialized maintenance for healthcare facilities",
      services: [
        {
          id: "medical-gas-systems",
          name: "Medical Gas System Maintenance",
          description: "Maintenance and certification of medical gas systems",
          estimatedDuration: "6-8 hours",
          priceRange: { min: 1000, max: 3000 },
          expertise: ["Medical Gas Systems Specialist"],
          materials: ["Testing Equipment", "Replacement Parts", "Certification Tools"],
          frequency: "Quarterly",
          compliance: ["NFPA 99", "Joint Commission Standards"],
          certifications: ["Medical Gas Systems Certification"]
        },
        {
          id: "sterilization-equipment",
          name: "Sterilization Equipment Maintenance",
          description: "Maintenance of medical sterilization equipment",
          estimatedDuration: "4-6 hours",
          priceRange: { min: 500, max: 1500 },
          expertise: ["Medical Equipment Specialist"],
          materials: ["Sterilization Testing Kits", "Replacement Parts"],
          frequency: "Monthly",
          compliance: ["CDC Guidelines", "FDA Requirements"],
          certifications: ["Medical Equipment Certification"]
        }
        // Will expand with 30+ more medical facility services
      ]
    },
    {
      id: "educational-facilities",
      name: "Educational Facility Maintenance",
      description: "Maintenance services for schools and educational institutions",
      services: [
        {
          id: "laboratory-maintenance",
          name: "Laboratory Equipment Maintenance",
          description: "Maintenance of educational laboratory equipment",
          estimatedDuration: "4-8 hours",
          priceRange: { min: 400, max: 1200 },
          expertise: ["Lab Equipment Specialist"],
          materials: ["Calibration Tools", "Safety Equipment", "Replacement Parts"],
          frequency: "Semi-annual",
          compliance: ["Education Department Standards", "Safety Regulations"],
          certifications: ["Laboratory Safety Certification"]
        }
        // Will expand with 25+ more educational facility services
      ]
    }
    // Will add more institutional subcategories
  ]
};
