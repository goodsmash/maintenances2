import { Icons } from "@/components/Icons";

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  services: Service[];
}

export interface Service {
  id: string;
  name: string;
  description: string;
  estimatedDuration: string;
  priceRange: {
    min: number;
    max: number;
  };
  urgencyLevels: UrgencyLevel[];
  requiredQualifications: string[];
  commonIssues: string[];
}

export interface UrgencyLevel {
  id: string;
  name: string;
  description: string;
  responseTime: string;
  priceMultiplier: number;
}

export const urgencyLevels: UrgencyLevel[] = [
  {
    id: 'routine',
    name: 'Routine',
    description: 'Regular maintenance or non-urgent repairs',
    responseTime: '3-5 business days',
    priceMultiplier: 1,
  },
  {
    id: 'priority',
    name: 'Priority',
    description: 'Issues requiring attention but not emergency',
    responseTime: '24-48 hours',
    priceMultiplier: 1.25,
  },
  {
    id: 'urgent',
    name: 'Urgent',
    description: 'Serious issues requiring quick response',
    responseTime: '4-8 hours',
    priceMultiplier: 1.5,
  },
  {
    id: 'emergency',
    name: 'Emergency',
    description: 'Critical issues requiring immediate attention',
    responseTime: '1-2 hours',
    priceMultiplier: 2,
  },
];

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'plumbing',
    name: 'Plumbing',
    description: 'Water supply, drainage, and plumbing fixture services',
    icon: 'Plumbing',
    services: [
      {
        id: 'leak_repair',
        name: 'Leak Detection & Repair',
        description: 'Identify and fix water leaks in pipes, fixtures, or appliances',
        estimatedDuration: '1-3 hours',
        priceRange: { min: 100, max: 500 },
        urgencyLevels: urgencyLevels,
        requiredQualifications: ['Licensed Plumber', 'Leak Detection Certification'],
        commonIssues: [
          'Dripping faucets',
          'Pipe leaks',
          'Water meter leaks',
          'Toilet leaks',
          'Hidden leaks in walls or floors',
          'Slab leaks',
          'Water pressure issues',
        ],
      },
      {
        id: 'drain_cleaning',
        name: 'Drain Cleaning',
        description: 'Clear clogged drains and prevent future blockages',
        estimatedDuration: '1-2 hours',
        priceRange: { min: 75, max: 300 },
        urgencyLevels: urgencyLevels,
        requiredQualifications: ['Licensed Plumber', 'Drain Cleaning Equipment Certification'],
        commonIssues: [
          'Slow drains',
          'Complete blockages',
          'Recurring clogs',
          'Bad odors',
          'Tree root intrusion',
          'Grease buildup',
        ],
      },
    ],
  },
  {
    id: 'hvac',
    name: 'HVAC',
    description: 'Heating, ventilation, and air conditioning services',
    icon: 'Climate',
    services: [
      {
        id: 'ac_repair',
        name: 'AC Repair & Maintenance',
        description: 'Comprehensive air conditioning repair and maintenance services',
        estimatedDuration: '2-4 hours',
        priceRange: { min: 150, max: 800 },
        urgencyLevels: urgencyLevels,
        requiredQualifications: ['HVAC Certified Technician', 'EPA 608 Certification'],
        commonIssues: [
          'Poor cooling',
          'Strange noises',
          'Refrigerant leaks',
          'Frozen coils',
          'Thermostat issues',
          'High energy bills',
        ],
      },
      {
        id: 'heating_repair',
        name: 'Heating System Repair',
        description: 'Furnace and heating system repairs and maintenance',
        estimatedDuration: '2-4 hours',
        priceRange: { min: 150, max: 900 },
        urgencyLevels: urgencyLevels,
        requiredQualifications: ['HVAC Certified Technician', 'Gas Furnace Certification'],
        commonIssues: [
          'No heat',
          'Uneven heating',
          'Pilot light issues',
          'Strange odors',
          'Frequent cycling',
          'Carbon monoxide concerns',
        ],
      },
    ],
  },
  {
    id: 'electrical',
    name: 'Electrical',
    description: 'Electrical system installation, repair, and maintenance',
    icon: 'Electrical',
    services: [
      {
        id: 'electrical_repair',
        name: 'Electrical Repairs',
        description: 'General electrical repairs and troubleshooting',
        estimatedDuration: '1-4 hours',
        priceRange: { min: 100, max: 600 },
        urgencyLevels: urgencyLevels,
        requiredQualifications: ['Licensed Electrician', 'Electrical Safety Certification'],
        commonIssues: [
          'Circuit breaker trips',
          'Outlet not working',
          'Flickering lights',
          'Electrical surges',
          'Hot outlets',
          'Outdated wiring',
        ],
      },
      {
        id: 'electrical_installation',
        name: 'Electrical Installation',
        description: 'New electrical installations and upgrades',
        estimatedDuration: '2-8 hours',
        priceRange: { min: 200, max: 1500 },
        urgencyLevels: urgencyLevels,
        requiredQualifications: ['Master Electrician', 'Electrical Installation Certification'],
        commonIssues: [
          'New circuit installation',
          'Panel upgrades',
          'Generator installation',
          'Smart home wiring',
          'Lighting installation',
          'EV charger installation',
        ],
      },
    ],
  },
  {
    id: 'pest_control',
    name: 'Pest Control',
    description: 'Comprehensive pest management and prevention services',
    icon: 'House',
    services: [
      {
        id: 'pest_inspection',
        name: 'Pest Inspection & Treatment',
        description: 'Thorough inspection and treatment of pest infestations',
        estimatedDuration: '1-3 hours',
        priceRange: { min: 100, max: 400 },
        urgencyLevels: urgencyLevels,
        requiredQualifications: ['Licensed Pest Control Technician', 'IPM Certification'],
        commonIssues: [
          'Ant infestations',
          'Roach problems',
          'Rodent control',
          'Bed bugs',
          'Termites',
          'Spider control',
        ],
      },
      {
        id: 'preventive_pest_control',
        name: 'Preventive Pest Control',
        description: 'Regular pest prevention and maintenance services',
        estimatedDuration: '1-2 hours',
        priceRange: { min: 75, max: 250 },
        urgencyLevels: urgencyLevels,
        requiredQualifications: ['Pest Control License', 'Prevention Specialist Certification'],
        commonIssues: [
          'Seasonal pest prevention',
          'Entry point sealing',
          'Pest monitoring',
          'Bait station maintenance',
          'Perimeter treatment',
          'Natural pest control',
        ],
      },
    ],
  },
  {
    id: 'landscaping',
    name: 'Landscaping',
    description: 'Professional landscaping and lawn care services',
    icon: 'Paint',
    services: [
      {
        id: 'lawn_maintenance',
        name: 'Lawn Maintenance',
        description: 'Regular lawn care and maintenance services',
        estimatedDuration: '1-4 hours',
        priceRange: { min: 50, max: 200 },
        urgencyLevels: urgencyLevels,
        requiredQualifications: ['Landscaping Certification', 'Equipment Operation License'],
        commonIssues: [
          'Grass cutting',
          'Edging and trimming',
          'Fertilization',
          'Weed control',
          'Aeration',
          'Seasonal cleanup',
        ],
      },
      {
        id: 'landscape_design',
        name: 'Landscape Design & Installation',
        description: 'Custom landscape design and installation services',
        estimatedDuration: '4-40 hours',
        priceRange: { min: 500, max: 10000 },
        urgencyLevels: urgencyLevels,
        requiredQualifications: ['Landscape Architecture License', 'Horticulture Certification'],
        commonIssues: [
          'Garden design',
          'Hardscape installation',
          'Plant selection',
          'Irrigation systems',
          'Lighting design',
          'Soil preparation',
        ],
      },
    ],
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    description: 'Professional cleaning and sanitation services',
    icon: 'House',
    services: [
      {
        id: 'regular_cleaning',
        name: 'Regular Cleaning Service',
        description: 'Scheduled cleaning and maintenance for homes and offices',
        estimatedDuration: '2-4 hours',
        priceRange: { min: 80, max: 300 },
        urgencyLevels: urgencyLevels,
        requiredQualifications: ['Professional Cleaning Certification', 'Safety Training'],
        commonIssues: [
          'General cleaning',
          'Dusting and vacuuming',
          'Bathroom sanitization',
          'Kitchen cleaning',
          'Floor maintenance',
          'Window cleaning',
        ],
      },
      {
        id: 'deep_cleaning',
        name: 'Deep Cleaning Service',
        description: 'Thorough deep cleaning and sanitization',
        estimatedDuration: '4-8 hours',
        priceRange: { min: 200, max: 800 },
        urgencyLevels: urgencyLevels,
        requiredQualifications: ['Advanced Cleaning Certification', 'Sanitization Specialist'],
        commonIssues: [
          'Move-in/move-out cleaning',
          'Spring cleaning',
          'Post-construction cleanup',
          'Carpet deep cleaning',
          'Upholstery cleaning',
          'Disinfection services',
        ],
      },
    ],
  },
  {
    id: 'security',
    name: 'Security Systems',
    description: 'Security system installation and monitoring',
    icon: 'Network',
    services: [
      {
        id: 'security_installation',
        name: 'Security System Installation',
        description: 'Installation of comprehensive security systems',
        estimatedDuration: '4-8 hours',
        priceRange: { min: 300, max: 2000 },
        urgencyLevels: urgencyLevels,
        requiredQualifications: ['Security Systems License', 'Installation Certification'],
        commonIssues: [
          'Camera installation',
          'Alarm system setup',
          'Access control',
          'Motion sensors',
          'Smart lock installation',
          'Video doorbell setup',
        ],
      },
      {
        id: 'security_maintenance',
        name: 'Security System Maintenance',
        description: 'Regular maintenance and updates of security systems',
        estimatedDuration: '1-3 hours',
        priceRange: { min: 100, max: 400 },
        urgencyLevels: urgencyLevels,
        requiredQualifications: ['Security Technician License', 'Maintenance Certification'],
        commonIssues: [
          'System updates',
          'Battery replacement',
          'Sensor calibration',
          'Camera cleaning',
          'Software updates',
          'Connection issues',
        ],
      },
    ],
  },
  {
    id: 'appliance',
    name: 'Appliance Repair',
    description: 'Repair and maintenance for all major home appliances',
    icon: 'Fridge',
    services: [
      {
        id: 'major_appliance_repair',
        name: 'Major Appliance Repair',
        description: 'Repair services for large household appliances',
        estimatedDuration: '1-4 hours',
        priceRange: { min: 100, max: 700 },
        urgencyLevels: urgencyLevels,
        requiredQualifications: ['Appliance Repair License', 'Brand Certifications'],
        commonIssues: [
          'Refrigerator repairs',
          'Washer/dryer issues',
          'Dishwasher problems',
          'Oven repairs',
          'Range/cooktop service',
          'Ice maker repairs',
        ],
      },
      {
        id: 'small_appliance_repair',
        name: 'Small Appliance Repair',
        description: 'Repair services for small household appliances',
        estimatedDuration: '1-2 hours',
        priceRange: { min: 50, max: 200 },
        urgencyLevels: urgencyLevels,
        requiredQualifications: ['Small Appliance Technician', 'Electrical Safety Certification'],
        commonIssues: [
          'Microwave repairs',
          'Coffee maker service',
          'Toaster repairs',
          'Blender issues',
          'Food processor problems',
          'Small electronics',
        ],
      },
    ],
  },
];
