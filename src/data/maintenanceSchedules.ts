export interface MaintenanceTask {
  id: string;
  title: string;
  description: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'biannual' | 'annual';
  estimatedTime: string;
  priority: 'low' | 'medium' | 'high';
  category: string;
  tools?: string[];
  steps: string[];
  notes?: string[];
}

export interface MaintenanceSchedule {
  id: string;
  name: string;
  description: string;
  tasks: MaintenanceTask[];
}

export const maintenanceSchedules: Record<string, MaintenanceSchedule> = {
  seasonal: {
    id: "seasonal",
    name: "Seasonal Maintenance",
    description: "Regular maintenance tasks based on seasons",
    tasks: [
      {
        id: "spring-hvac",
        title: "Spring HVAC Maintenance",
        description: "Prepare cooling system for summer",
        frequency: "annual",
        estimatedTime: "2-3 hours",
        priority: "high",
        category: "HVAC",
        tools: [
          "Air filter",
          "Fin comb",
          "Multimeter",
          "Cleaning supplies"
        ],
        steps: [
          "Replace air filter",
          "Clean outdoor unit",
          "Check refrigerant levels",
          "Test thermostat operation",
          "Clean condensate drain"
        ]
      },
      {
        id: "fall-winterize",
        title: "Fall Winterization",
        description: "Prepare home for winter weather",
        frequency: "annual",
        estimatedTime: "4-6 hours",
        priority: "high",
        category: "General",
        steps: [
          "Drain outdoor water lines",
          "Clean gutters",
          "Check roof condition",
          "Seal air leaks",
          "Service heating system"
        ]
      }
    ]
  },
  monthly: {
    id: "monthly",
    name: "Monthly Maintenance",
    description: "Regular monthly maintenance tasks",
    tasks: [
      {
        id: "hvac-filter",
        title: "HVAC Filter Check",
        description: "Inspect and replace HVAC filters as needed",
        frequency: "monthly",
        estimatedTime: "15-30 minutes",
        priority: "medium",
        category: "HVAC",
        steps: [
          "Turn off system",
          "Remove old filter",
          "Inspect filter condition",
          "Replace if dirty",
          "Record replacement date"
        ]
      },
      {
        id: "plumbing-check",
        title: "Plumbing Inspection",
        description: "Check for leaks and proper operation",
        frequency: "monthly",
        estimatedTime: "30-45 minutes",
        priority: "medium",
        category: "Plumbing",
        steps: [
          "Check under sinks",
          "Inspect toilet operation",
          "Test water pressure",
          "Check drain speeds",
          "Inspect visible pipes"
        ]
      }
    ]
  },
  quarterly: {
    id: "quarterly",
    name: "Quarterly Maintenance",
    description: "Tasks to be performed every three months",
    tasks: [
      {
        id: "smoke-detectors",
        title: "Test Safety Systems",
        description: "Check smoke and CO detectors",
        frequency: "quarterly",
        estimatedTime: "1 hour",
        priority: "high",
        category: "Safety",
        steps: [
          "Test all smoke detectors",
          "Test CO detectors",
          "Replace batteries if needed",
          "Clean detector surfaces",
          "Update maintenance log"
        ]
      }
    ]
  }
};

export interface PreventiveChecklist {
  id: string;
  name: string;
  description: string;
  frequency: string;
  items: {
    id: string;
    task: string;
    category: string;
    priority: 'low' | 'medium' | 'high';
    completed?: boolean;
    notes?: string;
  }[];
}

export const preventiveChecklists: PreventiveChecklist[] = [
  {
    id: "spring-checklist",
    name: "Spring Maintenance Checklist",
    description: "Comprehensive spring maintenance tasks",
    frequency: "Annual",
    items: [
      {
        id: "roof-inspection",
        task: "Inspect roof for winter damage",
        category: "Structural",
        priority: "high"
      },
      {
        id: "gutter-cleaning",
        task: "Clean and repair gutters",
        category: "Exterior",
        priority: "high"
      },
      {
        id: "ac-service",
        task: "Service air conditioning system",
        category: "HVAC",
        priority: "high"
      }
    ]
  },
  {
    id: "fall-checklist",
    name: "Fall Maintenance Checklist",
    description: "Prepare home for winter",
    frequency: "Annual",
    items: [
      {
        id: "heating-service",
        task: "Service heating system",
        category: "HVAC",
        priority: "high"
      },
      {
        id: "weatherization",
        task: "Check weatherstripping and seals",
        category: "Energy",
        priority: "medium"
      }
    ]
  }
];

// Helper function to get tasks by frequency
export function getTasksByFrequency(frequency: MaintenanceTask['frequency']): MaintenanceTask[] {
  return Object.values(maintenanceSchedules)
    .flatMap(schedule => schedule.tasks)
    .filter(task => task.frequency === frequency);
}

// Helper function to get upcoming tasks
export function getUpcomingTasks(days: number): MaintenanceTask[] {
  // In a real implementation, this would check against last completion dates
  return Object.values(maintenanceSchedules)
    .flatMap(schedule => schedule.tasks)
    .filter(task => task.priority === 'high');
}

// Helper function to get checklist by season
export function getSeasonalChecklist(season: string): PreventiveChecklist | undefined {
  return preventiveChecklists.find(checklist => 
    checklist.id.toLowerCase().includes(season.toLowerCase())
  );
}

// Helper function to estimate maintenance time
export function estimateMaintenanceTime(taskIds: string[]): string {
  const tasks = Object.values(maintenanceSchedules)
    .flatMap(schedule => schedule.tasks)
    .filter(task => taskIds.includes(task.id));

  const totalMinutes = tasks.reduce((total, task) => {
    const [min, max] = task.estimatedTime
      .replace(/[^0-9-]/g, '')
      .split('-')
      .map(Number);
    return total + (min + max) / 2;
  }, 0);

  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);

  return hours > 0 
    ? `${hours} hour${hours > 1 ? 's' : ''} ${minutes > 0 ? `${minutes} minutes` : ''}`
    : `${minutes} minutes`;
}
