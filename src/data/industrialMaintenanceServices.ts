import { MaintenanceCategory } from './maintenanceCategories';

export const industrialMaintenanceCategory: MaintenanceCategory = {
  id: "industrial",
  name: "Industrial Maintenance",
  description: "Specialized maintenance services for industrial facilities and equipment",
  icon: "industry",
  subCategories: [
    {
      id: "machinery",
      name: "Machinery Maintenance",
      description: "Preventive and corrective maintenance for industrial machinery",
      services: [
        {
          id: "preventive-maintenance",
          name: "Preventive Machinery Maintenance",
          description: "Scheduled maintenance to prevent equipment failure",
          estimatedDuration: "4-8 hours",
          priceRange: { min: 500, max: 2000 },
          expertise: ["Industrial Mechanic", "Maintenance Technician"],
          materials: ["Lubricants", "Replacement Parts", "Testing Equipment"],
          frequency: "Monthly",
          compliance: ["OSHA Standards", "Manufacturer Guidelines"],
          certifications: ["Certified Maintenance Technician"]
        },
        {
          id: "equipment-calibration",
          name: "Equipment Calibration",
          description: "Precision calibration of industrial equipment",
          estimatedDuration: "2-4 hours",
          priceRange: { min: 300, max: 1200 },
          expertise: ["Calibration Specialist"],
          materials: ["Calibration Tools", "Testing Equipment"],
          frequency: "Quarterly",
          compliance: ["ISO Standards", "Industry Specifications"],
          certifications: ["Calibration Certification"]
        }
        // Will expand with 30+ more machinery services
      ]
    },
    {
      id: "safety-systems",
      name: "Safety Systems",
      description: "Maintenance of industrial safety systems and equipment",
      services: [
        {
          id: "emergency-systems",
          name: "Emergency System Maintenance",
          description: "Maintenance of emergency response systems",
          estimatedDuration: "6-8 hours",
          priceRange: { min: 800, max: 2500 },
          expertise: ["Safety Systems Specialist", "Emergency Systems Technician"],
          materials: ["Safety Equipment", "Testing Devices", "Replacement Parts"],
          frequency: "Monthly",
          compliance: ["OSHA Requirements", "NFPA Standards"],
          certifications: ["Safety Systems Certification"]
        }
        // Will expand with 20+ more safety system services
      ]
    }
    // Will add more industrial subcategories
  ]
};
