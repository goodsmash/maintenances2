export interface IssueSuggestion {
  text: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'emergency';
  estimatedTime?: string;
  commonCauses?: string[];
}

export const issueSuggestions: Record<string, IssueSuggestion[]> = {
  plumbing: [
    {
      text: "No water pressure in all faucets",
      category: "Water Pressure",
      severity: "high",
      estimatedTime: "2-4 hours",
      commonCauses: ["Main water line issue", "Pressure regulator failure"]
    },
    {
      text: "Hot water not working",
      category: "Water Heater",
      severity: "high",
      estimatedTime: "2-4 hours",
      commonCauses: ["Heating element failure", "Thermostat issues"]
    },
    {
      text: "Clogged drain with standing water",
      category: "Drainage",
      severity: "medium",
      estimatedTime: "1-2 hours",
      commonCauses: ["Hair buildup", "Grease accumulation"]
    },
    {
      text: "Water leak under sink",
      category: "Leaks",
      severity: "high",
      estimatedTime: "1-2 hours",
      commonCauses: ["Pipe joint failure", "Worn out seals"]
    },
    {
      text: "Toilet constantly running",
      category: "Toilet",
      severity: "medium",
      estimatedTime: "1 hour",
      commonCauses: ["Faulty flapper", "Fill valve issues"]
    }
  ],
  hvac: [
    {
      text: "AC not cooling - warm air coming from vents",
      category: "Cooling",
      severity: "high",
      estimatedTime: "2-4 hours",
      commonCauses: ["Low refrigerant", "Compressor issues", "Dirty filter"]
    },
    {
      text: "Furnace not producing heat",
      category: "Heating",
      severity: "high",
      estimatedTime: "2-4 hours",
      commonCauses: ["Pilot light out", "Thermostat malfunction", "Gas supply issue"]
    },
    {
      text: "Strange noise from HVAC unit",
      category: "General",
      severity: "medium",
      estimatedTime: "1-2 hours",
      commonCauses: ["Loose components", "Belt issues", "Motor problems"]
    },
    {
      text: "Uneven heating/cooling between rooms",
      category: "Airflow",
      severity: "medium",
      estimatedTime: "2-3 hours",
      commonCauses: ["Duct issues", "Zoning problems", "Blocked vents"]
    }
  ],
  electrical: [
    {
      text: "Complete power loss to property",
      category: "Power",
      severity: "emergency",
      estimatedTime: "1-4 hours",
      commonCauses: ["Main breaker trip", "Service line issue"]
    },
    {
      text: "Circuit breaker keeps tripping",
      category: "Circuit Breaker",
      severity: "high",
      estimatedTime: "1-2 hours",
      commonCauses: ["Circuit overload", "Short circuit", "Ground fault"]
    },
    {
      text: "Flickering lights",
      category: "Lighting",
      severity: "medium",
      estimatedTime: "1-2 hours",
      commonCauses: ["Loose connection", "Voltage fluctuation"]
    },
    {
      text: "Outlet not working",
      category: "Outlets",
      severity: "medium",
      estimatedTime: "1 hour",
      commonCauses: ["GFCI trip", "Loose wiring", "Circuit overload"]
    },
    {
      text: "Burning smell from electrical panel",
      category: "Panel",
      severity: "emergency",
      estimatedTime: "1-3 hours",
      commonCauses: ["Overheated wires", "Loose connections"]
    }
  ],
  appliances: [
    {
      text: "Commercial refrigerator not cooling",
      category: "Refrigeration",
      severity: "emergency",
      estimatedTime: "2-4 hours",
      commonCauses: ["Compressor failure", "Refrigerant leak", "Thermostat issue"]
    },
    {
      text: "Commercial oven not heating",
      category: "Cooking Equipment",
      severity: "high",
      estimatedTime: "2-3 hours",
      commonCauses: ["Heating element failure", "Thermostat malfunction", "Gas supply issue"]
    },
    {
      text: "Dishwasher not cleaning properly",
      category: "Cleaning Equipment",
      severity: "medium",
      estimatedTime: "1-2 hours",
      commonCauses: ["Spray arm blockage", "Detergent dispenser issue", "Water temperature"]
    }
  ],
  structural: [
    {
      text: "Roof leak during rain",
      category: "Roofing",
      severity: "high",
      estimatedTime: "2-4 hours",
      commonCauses: ["Damaged shingles", "Flashing issues", "Ice dams"]
    },
    {
      text: "Foundation cracks",
      category: "Foundation",
      severity: "high",
      estimatedTime: "Varies",
      commonCauses: ["Settling", "Water damage", "Soil issues"]
    },
    {
      text: "Window not sealing properly",
      category: "Windows",
      severity: "medium",
      estimatedTime: "1-2 hours",
      commonCauses: ["Worn weatherstripping", "Frame damage", "Track issues"]
    }
  ],
  security: [
    {
      text: "Security system offline",
      category: "Security System",
      severity: "high",
      estimatedTime: "1-2 hours",
      commonCauses: ["Power issue", "Network connection", "Hardware failure"]
    },
    {
      text: "Access control system malfunction",
      category: "Access Control",
      severity: "high",
      estimatedTime: "1-3 hours",
      commonCauses: ["Software issue", "Hardware failure", "Power problem"]
    },
    {
      text: "Security cameras not recording",
      category: "Surveillance",
      severity: "high",
      estimatedTime: "1-2 hours",
      commonCauses: ["Storage full", "Network issue", "Camera malfunction"]
    }
  ]
};
