import { MaintenanceCategory } from './maintenanceCategories';

export const transportationMaintenanceCategory: MaintenanceCategory = {
  id: "transportation",
  name: "Transportation Maintenance",
  description: "Comprehensive maintenance services for transportation systems and facilities",
  icon: "truck",
  subCategories: [
    {
      id: "fleet-maintenance",
      name: "Fleet Vehicle Maintenance",
      description: "Maintenance services for commercial vehicle fleets",
      services: [
        {
          id: "preventive-fleet-maintenance",
          name: "Preventive Fleet Maintenance",
          description: "Scheduled maintenance to prevent vehicle breakdowns",
          estimatedDuration: "2-4 hours per vehicle",
          priceRange: { min: 200, max: 800 },
          expertise: ["Fleet Mechanic", "Automotive Technician"],
          materials: ["Filters", "Lubricants", "Parts"],
          frequency: "Monthly",
          certifications: ["ASE Certification"]
        },
        {
          id: "fleet-diagnostics",
          name: "Fleet Vehicle Diagnostics",
          description: "Comprehensive diagnostic testing of fleet vehicles",
          estimatedDuration: "1-2 hours per vehicle",
          priceRange: { min: 100, max: 300 },
          expertise: ["Diagnostic Technician"],
          materials: ["Diagnostic Equipment", "Testing Tools"],
          frequency: "Quarterly"
        }
        // ... (will continue with 40+ more fleet services)
      ]
    },
    {
      id: "parking-facilities",
      name: "Parking Facility Maintenance",
      description: "Maintenance of parking structures and equipment",
      services: [
        {
          id: "parking-equipment",
          name: "Parking Equipment Maintenance",
          description: "Maintenance of gates, payment systems, and access control",
          estimatedDuration: "4-6 hours",
          priceRange: { min: 300, max: 900 },
          expertise: ["Parking Systems Technician"],
          materials: ["Electronic Components", "Mechanical Parts"],
          frequency: "Monthly"
        }
        // ... (will continue with 30+ more parking facility services)
      ]
    },
    {
      id: "loading-systems",
      name: "Loading System Maintenance",
      description: "Maintenance of loading docks and equipment",
      services: [
        {
          id: "dock-leveler-maintenance",
          name: "Dock Leveler Maintenance",
          description: "Inspection and maintenance of dock leveling systems",
          estimatedDuration: "2-3 hours",
          priceRange: { min: 200, max: 600 },
          expertise: ["Loading Equipment Technician"],
          materials: ["Hydraulic Fluid", "Mechanical Parts"],
          frequency: "Quarterly"
        }
        // ... (will continue with 25+ more loading system services)
      ]
    }
    // ... (will add more transportation subcategories)
  ]
};
