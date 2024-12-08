export interface MaintenanceIssue {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'emergency';
  estimatedTime: string;
  estimatedCost: string;
  commonCauses: string[];
  preventiveMeasures: string[];
  requiredTools?: string[];
  professionalRequired: boolean;
  seasonalRelevance?: ('spring' | 'summer' | 'fall' | 'winter')[];
}

export interface Category {
  id: string;
  name: string;
  description: string;
  subcategories: {
    id: string;
    name: string;
    description: string;
    issues: MaintenanceIssue[];
  }[];
}

export const maintenanceCategories: Category[] = [
  {
    id: "plumbing",
    name: "Plumbing",
    description: "Water supply, drainage, and plumbing fixture issues",
    subcategories: [
      {
        id: "water-supply",
        name: "Water Supply",
        description: "Issues related to water delivery and pressure",
        issues: [
          {
            id: "low-water-pressure",
            title: "Low Water Pressure",
            description: "Reduced water flow from faucets or showerheads",
            severity: "medium",
            estimatedTime: "1-3 hours",
            estimatedCost: "$150-$500",
            commonCauses: [
              "Clogged pipes",
              "Pressure regulator failure",
              "Municipal supply issues",
              "Leaking pipes"
            ],
            preventiveMeasures: [
              "Regular pipe maintenance",
              "Water softener installation",
              "Pressure monitoring"
            ],
            requiredTools: [
              "Pressure gauge",
              "Pipe wrench",
              "Plumber's tape"
            ],
            professionalRequired: true
          },
          {
            id: "pipe-leak",
            title: "Pipe Leak",
            description: "Water leaking from supply lines",
            severity: "high",
            estimatedTime: "2-4 hours",
            estimatedCost: "$200-$1000",
            commonCauses: [
              "Pipe corrosion",
              "Joint failure",
              "Freezing damage",
              "High pressure"
            ],
            preventiveMeasures: [
              "Regular inspection",
              "Pipe insulation",
              "Pressure regulation"
            ],
            professionalRequired: true,
            seasonalRelevance: ["winter"]
          }
        ]
      },
      {
        id: "drainage",
        name: "Drainage",
        description: "Issues with water drainage and waste removal",
        issues: [
          {
            id: "clogged-drain",
            title: "Clogged Drain",
            description: "Slow or blocked water drainage",
            severity: "medium",
            estimatedTime: "30min-2hours",
            estimatedCost: "$100-$300",
            commonCauses: [
              "Hair buildup",
              "Grease accumulation",
              "Foreign objects",
              "Tree root intrusion"
            ],
            preventiveMeasures: [
              "Drain strainers",
              "Regular cleaning",
              "Enzyme treatments"
            ],
            requiredTools: [
              "Plunger",
              "Drain snake",
              "Chemical cleaner"
            ],
            professionalRequired: false
          }
        ]
      }
    ]
  },
  {
    id: "hvac",
    name: "HVAC",
    description: "Heating, ventilation, and air conditioning systems",
    subcategories: [
      {
        id: "cooling",
        name: "Cooling System",
        description: "Air conditioning and cooling related issues",
        issues: [
          {
            id: "ac-not-cooling",
            title: "AC Not Cooling",
            description: "Air conditioner running but not cooling effectively",
            severity: "high",
            estimatedTime: "2-4 hours",
            estimatedCost: "$200-$800",
            commonCauses: [
              "Low refrigerant",
              "Dirty filters",
              "Compressor issues",
              "Thermostat problems"
            ],
            preventiveMeasures: [
              "Regular maintenance",
              "Filter replacement",
              "Coil cleaning"
            ],
            requiredTools: [
              "Multimeter",
              "Pressure gauges",
              "Thermometer"
            ],
            professionalRequired: true,
            seasonalRelevance: ["summer"]
          },
          {
            id: "frozen-coil",
            title: "Frozen Evaporator Coil",
            description: "Ice buildup on AC coil",
            severity: "medium",
            estimatedTime: "2-6 hours",
            estimatedCost: "$150-$400",
            commonCauses: [
              "Low refrigerant",
              "Restricted airflow",
              "Fan failure",
              "Dirty filters"
            ],
            preventiveMeasures: [
              "Regular filter changes",
              "Annual maintenance",
              "Proper thermostat settings"
            ],
            professionalRequired: true,
            seasonalRelevance: ["summer"]
          }
        ]
      }
    ]
  },
  {
    id: "electrical",
    name: "Electrical",
    description: "Electrical systems and component issues",
    subcategories: [
      {
        id: "power",
        name: "Power Issues",
        description: "Problems with electrical power supply",
        issues: [
          {
            id: "circuit-breaker-trip",
            title: "Circuit Breaker Tripping",
            description: "Frequent circuit breaker trips",
            severity: "high",
            estimatedTime: "1-3 hours",
            estimatedCost: "$150-$500",
            commonCauses: [
              "Circuit overload",
              "Short circuit",
              "Ground fault",
              "Faulty appliance"
            ],
            preventiveMeasures: [
              "Load balancing",
              "Regular inspection",
              "GFCI protection"
            ],
            professionalRequired: true
          }
        ]
      }
    ]
  },
  {
    id: "structural",
    name: "Structural",
    description: "Building structure and foundation issues",
    subcategories: [
      {
        id: "foundation",
        name: "Foundation",
        description: "Foundation-related problems",
        issues: [
          {
            id: "foundation-crack",
            title: "Foundation Crack",
            description: "Cracks in foundation walls or floor",
            severity: "high",
            estimatedTime: "4-8 hours",
            estimatedCost: "$500-$3000",
            commonCauses: [
              "Settling",
              "Water damage",
              "Soil issues",
              "Poor drainage"
            ],
            preventiveMeasures: [
              "Proper drainage",
              "Moisture control",
              "Regular inspection"
            ],
            professionalRequired: true,
            seasonalRelevance: ["spring"]
          }
        ]
      }
    ]
  }
];

// Helper function to find issues by category
export function findIssuesByCategory(categoryId: string): MaintenanceIssue[] {
  const category = maintenanceCategories.find(cat => cat.id === categoryId);
  if (!category) return [];
  
  return category.subcategories.reduce((issues, subcat) => {
    return [...issues, ...subcat.issues];
  }, [] as MaintenanceIssue[]);
}

// Helper function to find issues by severity
export function findIssuesBySeverity(severity: MaintenanceIssue['severity']): MaintenanceIssue[] {
  return maintenanceCategories.reduce((issues, category) => {
    const categoryIssues = category.subcategories.reduce((subIssues, subcat) => {
      return [...subIssues, ...subcat.issues.filter(issue => issue.severity === severity)];
    }, [] as MaintenanceIssue[]);
    return [...issues, ...categoryIssues];
  }, [] as MaintenanceIssue[]);
}

// Helper function to find seasonal issues
export function findSeasonalIssues(season: string): MaintenanceIssue[] {
  return maintenanceCategories.reduce((issues, category) => {
    const categoryIssues = category.subcategories.reduce((subIssues, subcat) => {
      return [...subIssues, ...subcat.issues.filter(issue => 
        issue.seasonalRelevance?.includes(season as 'spring' | 'summer' | 'fall' | 'winter')
      )];
    }, [] as MaintenanceIssue[]);
    return [...issues, ...categoryIssues];
  }, [] as MaintenanceIssue[]);
}

// Helper function to estimate total cost for multiple issues
export function estimateTotalCost(issueIds: string[]): { min: number; max: number } {
  const costs = issueIds.reduce((total, issueId) => {
    const issue = findIssueById(issueId);
    if (!issue) return total;
    
    const [min, max] = issue.estimatedCost
      .replace('$', '')
      .split('-')
      .map(cost => parseInt(cost.replace(',', '')));
    
    return {
      min: total.min + min,
      max: total.max + max
    };
  }, { min: 0, max: 0 });
  
  return costs;
}

// Helper function to find an issue by ID
export function findIssueById(issueId: string): MaintenanceIssue | undefined {
  for (const category of maintenanceCategories) {
    for (const subcategory of category.subcategories) {
      const issue = subcategory.issues.find(issue => issue.id === issueId);
      if (issue) return issue;
    }
  }
  return undefined;
}
