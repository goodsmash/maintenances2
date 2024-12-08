import { MaintenanceIssue, CategoryData } from './maintenanceData';

export const commercialMaintenanceData: Record<string, CategoryData> = {
  restaurantPlumbing: {
    description: "Specialized plumbing services for restaurants and commercial kitchens",
    issues: [
      {
        title: "Grease Trap Overflow",
        description: "Grease trap system backing up or overflowing, requiring immediate attention",
        symptoms: [
          "Foul odors from drains",
          "Slow draining sinks",
          "Water backing up",
          "Visible grease overflow"
        ],
        severity: "severe",
        estimatedCost: "$300-$1000",
        timeToFix: "2-4 hours"
      },
      {
        title: "Commercial Dishwasher Drainage",
        description: "Issues with commercial dishwasher drainage system",
        symptoms: [
          "Water pooling around dishwasher",
          "Slow draining",
          "Bad odors",
          "Overflow during operation"
        ],
        severity: "moderate",
        estimatedCost: "$200-$600",
        timeToFix: "1-3 hours"
      },
      {
        title: "Bar Ice Well Drainage",
        description: "Problems with bar ice well drainage system",
        symptoms: [
          "Standing water in ice well",
          "Slow melting ice drainage",
          "Overflow issues",
          "Drain line blockage"
        ],
        severity: "moderate",
        estimatedCost: "$150-$400",
        timeToFix: "1-2 hours"
      }
    ]
  },
  commercialHVAC: {
    description: "Commercial HVAC services for restaurants and food service facilities",
    issues: [
      {
        title: "Kitchen Hood Ventilation Failure",
        description: "Commercial kitchen hood ventilation system not functioning properly",
        symptoms: [
          "Smoke accumulation",
          "Excessive heat in kitchen",
          "Poor air quality",
          "Hood fan noise issues"
        ],
        severity: "severe",
        estimatedCost: "$500-$2000",
        timeToFix: "4-8 hours"
      },
      {
        title: "Walk-in Freezer Temperature Control",
        description: "Temperature regulation issues in walk-in freezer",
        symptoms: [
          "Inconsistent temperature",
          "Frost buildup",
          "Door seal issues",
          "Compressor problems"
        ],
        severity: "emergency",
        estimatedCost: "$800-$3000",
        timeToFix: "2-6 hours"
      },
      {
        title: "Dining Room Climate Control",
        description: "Issues with dining area temperature regulation",
        symptoms: [
          "Uneven temperatures",
          "Hot/cold spots",
          "Poor air circulation",
          "Thermostat issues"
        ],
        severity: "moderate",
        estimatedCost: "$300-$1000",
        timeToFix: "2-4 hours"
      }
    ]
  },
  commercialAppliances: {
    description: "Maintenance for commercial kitchen and restaurant equipment",
    issues: [
      {
        title: "Commercial Oven Malfunction",
        description: "Issues with commercial grade ovens",
        symptoms: [
          "Uneven heating",
          "Temperature control issues",
          "Ignition problems",
          "Door seal failure"
        ],
        severity: "severe",
        estimatedCost: "$500-$2000",
        timeToFix: "2-6 hours"
      },
      {
        title: "Deep Fryer System Failure",
        description: "Problems with commercial deep fryer operation",
        symptoms: [
          "Temperature fluctuations",
          "Oil heating issues",
          "Safety system failures",
          "Control panel problems"
        ],
        severity: "severe",
        estimatedCost: "$400-$1500",
        timeToFix: "2-4 hours"
      },
      {
        title: "Commercial Refrigeration Issues",
        description: "Problems with commercial refrigeration units",
        symptoms: [
          "Temperature inconsistency",
          "Excessive frost",
          "Compressor issues",
          "Door seal problems"
        ],
        severity: "emergency",
        estimatedCost: "$600-$2500",
        timeToFix: "2-8 hours"
      }
    ]
  },
  foodServiceSafety: {
    description: "Safety and compliance maintenance for food service establishments",
    issues: [
      {
        title: "Fire Suppression System",
        description: "Issues with kitchen fire suppression system",
        symptoms: [
          "System warning lights",
          "Failed inspection",
          "Discharge issues",
          "Sensor malfunctions"
        ],
        severity: "emergency",
        estimatedCost: "$1000-$5000",
        timeToFix: "4-8 hours"
      },
      {
        title: "Food Storage Temperature Control",
        description: "Problems maintaining safe food storage temperatures",
        symptoms: [
          "Temperature fluctuations",
          "Equipment failure",
          "Monitoring system issues",
          "Compliance violations"
        ],
        severity: "severe",
        estimatedCost: "$400-$1500",
        timeToFix: "2-4 hours"
      }
    ]
  },
  sanitationSystems: {
    description: "Commercial kitchen and restaurant sanitation system maintenance",
    issues: [
      {
        title: "Sanitizer System Failure",
        description: "Issues with chemical sanitizing systems",
        symptoms: [
          "Improper chemical mix",
          "Dispensing problems",
          "System blockage",
          "Control unit failure"
        ],
        severity: "severe",
        estimatedCost: "$300-$1000",
        timeToFix: "1-3 hours"
      },
      {
        title: "Dishwashing System Problems",
        description: "Commercial dishwasher maintenance issues",
        symptoms: [
          "Poor cleaning results",
          "Temperature issues",
          "Chemical feed problems",
          "Mechanical failures"
        ],
        severity: "moderate",
        estimatedCost: "$200-$800",
        timeToFix: "2-4 hours"
      }
    ]
  }
};
