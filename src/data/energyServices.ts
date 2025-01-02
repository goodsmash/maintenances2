import { MaintenanceCategory } from './maintenanceCategories';

export const energyMaintenanceCategory: MaintenanceCategory = {
  id: "energy",
  name: "Energy Systems",
  description: "Maintenance services for energy generation and distribution systems",
  icon: "bolt",
  subCategories: [
    {
      id: "solar-systems",
      name: "Solar Power Systems",
      description: "Maintenance of solar power generation systems",
      services: [
        {
          id: "solar-panel-maintenance",
          name: "Solar Panel Maintenance",
          description: "Inspection and maintenance of solar panel arrays",
          estimatedDuration: "4-6 hours",
          priceRange: { min: 300, max: 900 },
          expertise: ["Solar Technician"],
          materials: ["Cleaning Supplies", "Testing Equipment"],
          frequency: "Quarterly",
          certifications: ["Solar PV Installation Certification"]
        },
        {
          id: "inverter-maintenance",
          name: "Solar Inverter Maintenance",
          description: "Maintenance of solar power inverters",
          estimatedDuration: "2-3 hours",
          priceRange: { min: 200, max: 600 },
          expertise: ["Solar Inverter Specialist"],
          materials: ["Electronic Components", "Testing Equipment"],
          frequency: "Semi-annual"
        }
        // ... (will continue with 30+ more solar services)
      ]
    },
    {
      id: "backup-power",
      name: "Backup Power Systems",
      description: "Maintenance of emergency and backup power systems",
      services: [
        {
          id: "generator-maintenance",
          name: "Generator Maintenance",
          description: "Preventive maintenance of backup generators",
          estimatedDuration: "3-5 hours",
          priceRange: { min: 250, max: 800 },
          expertise: ["Generator Technician"],
          materials: ["Filters", "Oil", "Spark Plugs"],
          frequency: "Quarterly"
        }
        // ... (will continue with 25+ more backup power services)
      ]
    },
    {
      id: "energy-efficiency",
      name: "Energy Efficiency Systems",
      description: "Maintenance of energy optimization systems",
      services: [
        {
          id: "energy-audit",
          name: "Energy System Audit",
          description: "Comprehensive audit of energy usage and systems",
          estimatedDuration: "6-8 hours",
          priceRange: { min: 500, max: 1500 },
          expertise: ["Energy Auditor"],
          materials: ["Monitoring Equipment", "Analysis Tools"],
          frequency: "Annual",
          certifications: ["Certified Energy Auditor"]
        }
        // ... (will continue with 30+ more energy efficiency services)
      ]
    }
    // ... (will add more energy subcategories)
  ]
};
