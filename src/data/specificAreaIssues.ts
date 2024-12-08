import type { MaintenanceIssue } from './maintenanceIssues';

export const specificAreaIssues: Record<string, MaintenanceIssue[]> = {
  kitchen: [
    {
      id: "kitchen-sink-clog",
      title: "Kitchen Sink Clog",
      description: "Slow draining or completely blocked kitchen sink",
      severity: "medium",
      estimatedTime: "1-2 hours",
      estimatedCost: "$100-$300",
      commonCauses: [
        "Food debris accumulation",
        "Grease buildup",
        "Foreign objects",
        "Pipe scale buildup"
      ],
      preventiveMeasures: [
        "Use sink strainer",
        "Regular drain cleaning",
        "Avoid pouring grease down drain",
        "Hot water flushing"
      ],
      requiredTools: [
        "Plunger",
        "Drain snake",
        "Pipe wrench",
        "Bucket"
      ],
      professionalRequired: false
    },
    {
      id: "garbage-disposal-jam",
      title: "Garbage Disposal Jam",
      description: "Disposal unit stuck or making unusual noise",
      severity: "medium",
      estimatedTime: "30min-1hour",
      estimatedCost: "$150-$400",
      commonCauses: [
        "Foreign objects",
        "Overloading",
        "Motor failure",
        "Blade damage"
      ],
      preventiveMeasures: [
        "Proper food disposal",
        "Regular cleaning",
        "Cold water running",
        "Avoid hard items"
      ],
      professionalRequired: false
    }
  ],
  bathroom: [
    {
      id: "toilet-overflow",
      title: "Toilet Overflow",
      description: "Toilet bowl overflowing when flushed",
      severity: "high",
      estimatedTime: "1-3 hours",
      estimatedCost: "$200-$500",
      commonCauses: [
        "Clogged drain line",
        "Blocked vent stack",
        "Faulty float mechanism",
        "Sewer line backup"
      ],
      preventiveMeasures: [
        "Regular cleaning",
        "Proper paper usage",
        "Flapper maintenance",
        "Annual inspection"
      ],
      professionalRequired: true
    },
    {
      id: "shower-pressure-low",
      title: "Low Shower Pressure",
      description: "Reduced water flow from showerhead",
      severity: "medium",
      estimatedTime: "1-2 hours",
      estimatedCost: "$100-$300",
      commonCauses: [
        "Mineral buildup",
        "Clogged showerhead",
        "Pressure regulator issue",
        "Pipe restriction"
      ],
      preventiveMeasures: [
        "Regular cleaning",
        "Water softener use",
        "Filter installation",
        "Pressure monitoring"
      ],
      professionalRequired: false
    }
  ],
  basement: [
    {
      id: "water-seepage",
      title: "Water Seepage",
      description: "Water entering through basement walls or floor",
      severity: "high",
      estimatedTime: "4-8 hours",
      estimatedCost: "$500-$3000",
      commonCauses: [
        "Poor drainage",
        "Foundation cracks",
        "Hydrostatic pressure",
        "Gutter issues"
      ],
      preventiveMeasures: [
        "Proper grading",
        "Gutter maintenance",
        "Waterproofing",
        "Sump pump installation"
      ],
      professionalRequired: true,
      seasonalRelevance: ["spring", "summer"]
    },
    {
      id: "sump-pump-failure",
      title: "Sump Pump Failure",
      description: "Sump pump not operating or inadequate pumping",
      severity: "high",
      estimatedTime: "2-4 hours",
      estimatedCost: "$400-$1000",
      commonCauses: [
        "Power failure",
        "Switch malfunction",
        "Clogged intake",
        "Worn out pump"
      ],
      preventiveMeasures: [
        "Regular testing",
        "Backup power system",
        "Clean pit regularly",
        "Annual maintenance"
      ],
      professionalRequired: true,
      seasonalRelevance: ["spring", "summer"]
    }
  ],
  garage: [
    {
      id: "door-opener-failure",
      title: "Garage Door Opener Failure",
      description: "Garage door not responding to opener",
      severity: "medium",
      estimatedTime: "2-3 hours",
      estimatedCost: "$200-$500",
      commonCauses: [
        "Motor failure",
        "Remote issues",
        "Sensor alignment",
        "Track problems"
      ],
      preventiveMeasures: [
        "Regular lubrication",
        "Track cleaning",
        "Spring inspection",
        "Safety sensor check"
      ],
      professionalRequired: true
    },
    {
      id: "door-track-misalignment",
      title: "Door Track Misalignment",
      description: "Garage door not moving smoothly or making noise",
      severity: "high",
      estimatedTime: "2-4 hours",
      estimatedCost: "$150-$400",
      commonCauses: [
        "Impact damage",
        "Loose hardware",
        "Worn rollers",
        "Bent track"
      ],
      preventiveMeasures: [
        "Regular inspection",
        "Proper operation",
        "Hardware tightening",
        "Professional adjustment"
      ],
      professionalRequired: true
    }
  ]
};

// Helper function to get issues by room
export function getIssuesByRoom(room: string): MaintenanceIssue[] {
  return specificAreaIssues[room] || [];
}

// Helper function to get all emergency issues across rooms
export function getEmergencyIssues(): MaintenanceIssue[] {
  return Object.values(specificAreaIssues)
    .flat()
    .filter(issue => issue.severity === 'emergency');
}

// Helper function to get seasonal maintenance checklist
export function getSeasonalChecklist(season: string): MaintenanceIssue[] {
  return Object.values(specificAreaIssues)
    .flat()
    .filter(issue => issue.seasonalRelevance?.includes(season as 'spring' | 'summer' | 'fall' | 'winter'));
}

// Helper function to estimate maintenance costs by room
export function estimateRoomMaintenanceCost(room: string): { min: number; max: number } {
  const issues = specificAreaIssues[room] || [];
  return issues.reduce((total, issue) => {
    const [min, max] = issue.estimatedCost
      .replace('$', '')
      .split('-')
      .map(cost => parseInt(cost.replace(',', '')));
    
    return {
      min: total.min + min,
      max: total.max + max
    };
  }, { min: 0, max: 0 });
}
