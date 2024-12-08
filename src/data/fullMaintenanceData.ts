import { MaintenanceIssue, CategoryData } from './maintenanceData';

export const fullMaintenanceData: Record<string, CategoryData> = {
  electrical: {
    description: "Comprehensive electrical services for residential and commercial properties",
    issues: [
      {
        title: "Power Outage",
        description: "Complete loss of electrical power in part or all of the property",
        symptoms: ["No electricity", "Partial power loss", "Flickering before outage"],
        severity: "severe",
        estimatedCost: "$150-$500",
        timeToFix: "2-4 hours"
      },
      {
        title: "Circuit Breaker Tripping",
        description: "Frequent circuit breaker trips indicating potential overload",
        symptoms: ["Repeated trips", "Hot panel", "Burning smell"],
        severity: "moderate",
        estimatedCost: "$100-$300",
        timeToFix: "1-2 hours"
      },
      {
        title: "Electrical Fire Risk",
        description: "Signs of potential electrical fire hazard",
        symptoms: ["Burning smell", "Hot outlets", "Sparking"],
        severity: "emergency",
        estimatedCost: "$500-$2000",
        timeToFix: "Immediate response"
      },
      // Add 97 more electrical issues
    ]
  },
  plumbing: {
    description: "Expert plumbing services for all types of water and drainage systems",
    issues: [
      {
        title: "Burst Pipe",
        description: "Pipe rupture causing water leakage and potential flooding",
        symptoms: ["Water spraying", "Flooding", "Low pressure"],
        severity: "emergency",
        estimatedCost: "$500-$2000",
        timeToFix: "2-6 hours"
      },
      {
        title: "Sewer Backup",
        description: "Sewage backing up into property through drains",
        symptoms: ["Bad odors", "Slow drains", "Gurgling sounds"],
        severity: "severe",
        estimatedCost: "$300-$1000",
        timeToFix: "3-5 hours"
      },
      // Add 98 more plumbing issues
    ]
  },
  hvac: {
    description: "Complete heating, ventilation, and air conditioning services",
    issues: [
      {
        title: "No Cooling",
        description: "AC system not producing cold air",
        symptoms: ["Warm air from vents", "Unit running constantly", "High energy bills"],
        severity: "severe",
        estimatedCost: "$200-$800",
        timeToFix: "2-4 hours"
      },
      {
        title: "Furnace Failure",
        description: "Heating system not producing warm air",
        symptoms: ["No heat", "Cold spots", "Strange noises"],
        severity: "severe",
        estimatedCost: "$300-$1200",
        timeToFix: "2-6 hours"
      },
      // Add 98 more HVAC issues
    ]
  },
  roofing: {
    description: "Professional roofing services for all types of structures",
    issues: [
      {
        title: "Major Leak",
        description: "Significant water penetration through roof",
        symptoms: ["Water stains", "Dripping", "Mold growth"],
        severity: "severe",
        estimatedCost: "$500-$2000",
        timeToFix: "4-8 hours"
      },
      {
        title: "Storm Damage",
        description: "Roof damage from severe weather",
        symptoms: ["Missing shingles", "Visible holes", "Interior leaks"],
        severity: "emergency",
        estimatedCost: "$1000-$5000",
        timeToFix: "1-3 days"
      },
      // Add 98 more roofing issues
    ]
  },
  painting: {
    description: "Professional painting services for interior and exterior surfaces",
    issues: [
      {
        title: "Interior Wall Damage",
        description: "Wall surface requiring repair and painting",
        symptoms: ["Peeling paint", "Water stains", "Cracks"],
        severity: "minor",
        estimatedCost: "$200-$600",
        timeToFix: "1-2 days"
      },
      {
        title: "Exterior Paint Failure",
        description: "Deteriorating exterior paint requiring attention",
        symptoms: ["Peeling", "Fading", "Wood rot"],
        severity: "moderate",
        estimatedCost: "$1000-$4000",
        timeToFix: "2-4 days"
      },
      // Add 98 more painting issues
    ]
  },
  pestControl: {
    description: "Comprehensive pest control and prevention services",
    issues: [
      {
        title: "Rodent Infestation",
        description: "Active rodent presence in property",
        symptoms: ["Droppings", "Gnaw marks", "Noises in walls"],
        severity: "severe",
        estimatedCost: "$300-$1000",
        timeToFix: "Multiple visits"
      },
      {
        title: "Termite Presence",
        description: "Active termite infestation requiring treatment",
        symptoms: ["Wood damage", "Mud tubes", "Swarmers"],
        severity: "severe",
        estimatedCost: "$500-$2000",
        timeToFix: "Multiple visits"
      },
      // Add 48 more pest control issues
    ]
  },
  // Continue with more categories...
};
