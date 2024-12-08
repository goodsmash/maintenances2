export interface MaintenanceIssue {
  title: string;
  description: string;
  symptoms: string[];
  severity: 'minor' | 'moderate' | 'severe' | 'emergency';
  estimatedCost: string;
  timeToFix: string;
}

export interface CategoryData {
  description: string;
  issues: MaintenanceIssue[];
}

export const maintenanceData: Record<string, CategoryData> = {
  electrical: {
    description: "Comprehensive electrical services for residential and commercial properties",
    issues: [
      {
        title: "Power Outage",
        description: "Complete loss of electrical power in part or all of the property",
        symptoms: [
          "No electricity in entire building",
          "Partial power loss in specific areas",
          "Flickering lights before outage",
          "Tripped circuit breakers"
        ],
        severity: "severe",
        estimatedCost: "$150-$500",
        timeToFix: "2-4 hours"
      },
      {
        title: "Circuit Breaker Issues",
        description: "Problems with circuit breakers tripping or not functioning properly",
        symptoms: [
          "Frequent breaker trips",
          "Breaker won't reset",
          "Hot breaker panel",
          "Burning smell from panel"
        ],
        severity: "moderate",
        estimatedCost: "$100-$300",
        timeToFix: "1-2 hours"
      },
      // Add 20+ more electrical issues
    ]
  },
  plumbing: {
    description: "Expert plumbing services for all types of water and drainage systems",
    issues: [
      {
        title: "Burst Pipe",
        description: "Pipe rupture causing water leakage and potential flooding",
        symptoms: [
          "Water spraying or pooling",
          "Sudden drop in water pressure",
          "Water stains on walls/ceiling",
          "Sound of running water when no taps are on"
        ],
        severity: "emergency",
        estimatedCost: "$500-$2000",
        timeToFix: "2-6 hours"
      },
      {
        title: "Clogged Drain",
        description: "Blocked drainage causing slow water flow or complete blockage",
        symptoms: [
          "Water draining slowly",
          "Standing water in sink/tub",
          "Gurgling sounds",
          "Bad odors from drain"
        ],
        severity: "moderate",
        estimatedCost: "$100-$300",
        timeToFix: "1-2 hours"
      },
      // Add 20+ more plumbing issues
    ]
  },
  hvac: {
    description: "Complete heating, ventilation, and air conditioning services",
    issues: [
      {
        title: "AC Not Cooling",
        description: "Air conditioning system failing to cool the space effectively",
        symptoms: [
          "Warm air from vents",
          "Inconsistent cooling",
          "Unusual noises",
          "Higher energy bills"
        ],
        severity: "moderate",
        estimatedCost: "$200-$800",
        timeToFix: "2-4 hours"
      },
      // Add 20+ more HVAC issues
    ]
  },
  roofing: {
    description: "Professional roofing services for all types of structures",
    issues: [
      {
        title: "Roof Leak",
        description: "Water penetration through roof causing interior damage",
        symptoms: [
          "Water stains on ceiling",
          "Dripping water",
          "Mold growth",
          "Damaged insulation"
        ],
        severity: "severe",
        estimatedCost: "$500-$2000",
        timeToFix: "4-8 hours"
      },
      // Add 20+ more roofing issues
    ]
  },
  // Add more categories with their specific issues
};

export const severityColors = {
  minor: "bg-blue-100 text-blue-800",
  moderate: "bg-yellow-100 text-yellow-800",
  severe: "bg-orange-100 text-orange-800",
  emergency: "bg-red-100 text-red-800"
};
