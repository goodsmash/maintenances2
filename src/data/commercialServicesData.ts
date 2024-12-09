import React from 'react';
import { Icons } from "@/components/Icons";

export interface CommercialService {
  id: string;
  name: string;
  icon: React.ComponentType<{className?: string}>;
  description: string;
  keyBenefits: string[];
  serviceTypes: string[];
  priceRange: string;
  industryFocus: string[];
}

export const commercialServices: CommercialService[] = [
  {
    id: "hvac-commercial",
    name: "Commercial HVAC Services",
    icon: Icons.Climate,
    description: "Comprehensive HVAC solutions for businesses of all sizes and industries.",
    keyBenefits: [
      "24/7 emergency repair",
      "Energy efficiency optimization",
      "Preventive maintenance plans",
      "Advanced diagnostic technologies"
    ],
    serviceTypes: [
      "System installation",
      "Routine maintenance",
      "Emergency repairs",
      "Energy efficiency audits",
      "Ductwork cleaning and repair"
    ],
    priceRange: "$500 - $5,000",
    industryFocus: [
      "Offices", 
      "Retail Spaces", 
      "Warehouses", 
      "Restaurants", 
      "Healthcare Facilities"
    ]
  },
  {
    id: "electrical-commercial",
    name: "Commercial Electrical Services",
    icon: Icons.Electrical,
    description: "Professional electrical maintenance and installation for commercial properties.",
    keyBenefits: [
      "Licensed and insured electricians",
      "Compliance with safety regulations",
      "Minimal business disruption",
      "Advanced electrical system design"
    ],
    serviceTypes: [
      "Electrical system upgrades",
      "Lighting installation",
      "Electrical safety inspections",
      "Backup generator services",
      "Electrical panel upgrades"
    ],
    priceRange: "$300 - $3,500",
    industryFocus: [
      "Manufacturing", 
      "Hospitality", 
      "Educational Institutions", 
      "Retail", 
      "Corporate Campuses"
    ]
  },
  {
    id: "plumbing-commercial",
    name: "Commercial Plumbing Services",
    icon: Icons.Plumbing,
    description: "Comprehensive plumbing solutions for commercial and industrial properties.",
    keyBenefits: [
      "Rapid response times",
      "Advanced leak detection",
      "Water efficiency consulting",
      "Minimal operational disruption"
    ],
    serviceTypes: [
      "Pipe repairs and replacements",
      "Drain cleaning",
      "Water heater services",
      "Backflow prevention",
      "Plumbing system upgrades"
    ],
    priceRange: "$400 - $4,000",
    industryFocus: [
      "Restaurants", 
      "Hotels", 
      "Hospitals", 
      "Shopping Centers", 
      "Industrial Facilities"
    ]
  },
  {
    id: "facility-maintenance",
    name: "Comprehensive Facility Maintenance",
    icon: Icons.Building,
    description: "All-in-one maintenance solutions for complex commercial properties.",
    keyBenefits: [
      "Integrated maintenance approach",
      "Customized service plans",
      "Predictive maintenance technologies",
      "Single point of contact"
    ],
    serviceTypes: [
      "Preventive maintenance",
      "Repair and replacement",
      "Infrastructure assessment",
      "Emergency response",
      "Sustainability consulting"
    ],
    priceRange: "$1,000 - $10,000",
    industryFocus: [
      "Corporate Campuses", 
      "Multi-tenant Buildings", 
      "Educational Institutions", 
      "Healthcare Complexes", 
      "Government Facilities"
    ]
  },
  {
    id: "it-infrastructure",
    name: "IT Infrastructure Maintenance",
    icon: Icons.Network,
    description: "Comprehensive technology infrastructure support for modern businesses.",
    keyBenefits: [
      "Proactive system monitoring",
      "Cybersecurity integration",
      "Rapid troubleshooting",
      "Technology lifecycle management"
    ],
    serviceTypes: [
      "Network infrastructure maintenance",
      "Server room climate control",
      "Cabling and connectivity",
      "Hardware repair and replacement",
      "Cybersecurity assessments"
    ],
    priceRange: "$500 - $5,000",
    industryFocus: [
      "Tech Companies", 
      "Financial Services", 
      "Healthcare IT", 
      "Educational Technology", 
      "Telecommunications"
    ]
  }
];
