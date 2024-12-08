import type { MaintenanceIssue } from './maintenanceIssues';

export interface SpecializedArea {
  id: string;
  name: string;
  description: string;
  issues: MaintenanceIssue[];
  specialConsiderations: string[];
  requiredPermits?: string[];
  safetyGuidelines: string[];
}

export const specializedAreas: Record<string, SpecializedArea> = {
  outdoorLiving: {
    id: "outdoor-living",
    name: "Outdoor Living Spaces",
    description: "Patios, decks, and outdoor entertainment areas",
    specialConsiderations: [
      "Weather exposure",
      "Seasonal maintenance requirements",
      "Material durability",
      "Local regulations"
    ],
    safetyGuidelines: [
      "Regular structural inspection",
      "Proper drainage maintenance",
      "Surface treatment for slip prevention",
      "Adequate lighting"
    ],
    issues: [
      {
        id: "deck-rot",
        title: "Deck Wood Rot",
        description: "Deteriorating deck boards or support structure",
        severity: "high",
        estimatedTime: "4-8 hours",
        estimatedCost: "$500-$2000",
        commonCauses: [
          "Water damage",
          "Poor ventilation",
          "Inadequate sealing",
          "Age-related wear"
        ],
        preventiveMeasures: [
          "Annual sealing",
          "Regular cleaning",
          "Proper drainage",
          "Ventilation maintenance"
        ],
        professionalRequired: true,
        seasonalRelevance: ["spring"]
      },
      {
        id: "patio-settling",
        title: "Patio Settlement",
        description: "Uneven or sinking patio surface",
        severity: "medium",
        estimatedTime: "6-12 hours",
        estimatedCost: "$800-$3000",
        commonCauses: [
          "Soil erosion",
          "Poor base preparation",
          "Drainage issues",
          "Freeze-thaw cycles"
        ],
        preventiveMeasures: [
          "Proper drainage maintenance",
          "Joint sealing",
          "Regular inspection",
          "Soil stabilization"
        ],
        professionalRequired: true,
        seasonalRelevance: ["spring", "fall"]
      }
    ]
  },
  poolSpa: {
    id: "pool-spa",
    name: "Pool and Spa",
    description: "Swimming pools, hot tubs, and related equipment",
    specialConsiderations: [
      "Water chemistry balance",
      "Equipment maintenance",
      "Safety requirements",
      "Energy efficiency"
    ],
    safetyGuidelines: [
      "Regular water testing",
      "Safety barrier maintenance",
      "Emergency equipment checks",
      "Chemical handling procedures"
    ],
    requiredPermits: [
      "Pool operation permit",
      "Safety barrier compliance",
      "Equipment installation permits"
    ],
    issues: [
      {
        id: "pump-failure",
        title: "Pool Pump Failure",
        description: "Pool pump not operating or making unusual noise",
        severity: "high",
        estimatedTime: "2-4 hours",
        estimatedCost: "$400-$1200",
        commonCauses: [
          "Motor failure",
          "Impeller damage",
          "Electrical issues",
          "Age-related wear"
        ],
        preventiveMeasures: [
          "Regular maintenance",
          "Proper priming",
          "Basket cleaning",
          "Winter preparation"
        ],
        professionalRequired: true,
        seasonalRelevance: ["summer"]
      }
    ]
  },
  homeTheater: {
    id: "home-theater",
    name: "Home Theater",
    description: "Dedicated entertainment and audio-visual systems",
    specialConsiderations: [
      "Acoustic treatment",
      "Lighting control",
      "Equipment ventilation",
      "Power management"
    ],
    safetyGuidelines: [
      "Proper ventilation",
      "Electrical load management",
      "Cable management",
      "Fire safety"
    ],
    issues: [
      {
        id: "projector-overheating",
        title: "Projector Overheating",
        description: "Projector shutting down or displaying warning",
        severity: "medium",
        estimatedTime: "1-2 hours",
        estimatedCost: "$200-$500",
        commonCauses: [
          "Dust buildup",
          "Poor ventilation",
          "Filter clog",
          "Fan failure"
        ],
        preventiveMeasures: [
          "Regular cleaning",
          "Filter replacement",
          "Proper ventilation",
          "Temperature monitoring"
        ],
        professionalRequired: false
      }
    ]
  },
  wineRoom: {
    id: "wine-room",
    name: "Wine Room/Cellar",
    description: "Dedicated wine storage and aging space",
    specialConsiderations: [
      "Temperature control",
      "Humidity management",
      "Light protection",
      "Vibration minimization"
    ],
    safetyGuidelines: [
      "Moisture monitoring",
      "Ventilation maintenance",
      "Temperature logging",
      "Emergency power backup"
    ],
    issues: [
      {
        id: "temp-fluctuation",
        title: "Temperature Fluctuation",
        description: "Inconsistent wine storage temperature",
        severity: "high",
        estimatedTime: "2-4 hours",
        estimatedCost: "$300-$1000",
        commonCauses: [
          "Cooling system failure",
          "Poor insulation",
          "Door seal issues",
          "Thermostat malfunction"
        ],
        preventiveMeasures: [
          "Regular monitoring",
          "Seal inspection",
          "System maintenance",
          "Backup power system"
        ],
        professionalRequired: true
      }
    ]
  }
};
