import React from 'react';
import { Icons } from "@/components/Icons";

export interface ContractorService {
  id: string;
  name: string;
  icon: React.ComponentType<{className?: string}>;
  shortDescription: string;
  fullDescription: string;
  serviceTypes: string[];
  keyBenefits: string[];
  recommendedFor: string[];
  priceRange: string;
  preparationSteps: string[];
  aftercareTips: string[];
  industryStandards?: string[];
  safetyProtocols?: string[];
}

export const contractorServices: ContractorService[] = [
  {
    id: "construction-management",
    name: "Construction Management",
    icon: Icons.Building,
    shortDescription: "Comprehensive project oversight and coordination for construction projects",
    fullDescription: "Professional construction management services that ensure efficient, safe, and high-quality project delivery from concept to completion.",
    serviceTypes: [
      "Residential Construction Management",
      "Commercial Building Oversight",
      "Renovation Project Coordination",
      "New Development Planning",
      "Phased Construction Management",
      "Historic Restoration Projects",
      "Multi-Unit Housing Development",
      "Industrial Facility Construction",
      "Infrastructure Project Management",
      "Green Building Certification Support"
    ],
    keyBenefits: [
      "Streamlined project execution",
      "Cost-effective solutions",
      "Reduced project risks",
      "Timely completion",
      "High-quality standards",
      "Comprehensive reporting",
      "Expert vendor and subcontractor coordination"
    ],
    recommendedFor: [
      "Large Construction Projects",
      "Commercial Developments",
      "Residential Complex Projects",
      "Industrial Facilities",
      "Infrastructure Projects",
      "Real Estate Developers",
      "Municipal Governments"
    ],
    priceRange: "$5,000 - $250,000",
    preparationSteps: [
      "Initial project consultation",
      "Detailed project scope definition",
      "Comprehensive risk assessment",
      "Resource and team allocation",
      "Preliminary budget and timeline development",
      "Permit and regulatory compliance review",
      "Site feasibility analysis"
    ],
    aftercareTips: [
      "Conduct post-project review",
      "Document lessons learned",
      "Maintain comprehensive project records",
      "Perform final quality inspections",
      "Develop maintenance recommendations"
    ],
    industryStandards: [
      "PMBOK Guidelines",
      "OSHA Safety Regulations",
      "Local Building Codes",
      "AIA Contract Documents",
      "LEED Certification Standards"
    ],
    safetyProtocols: [
      "Mandatory Safety Training",
      "Personal Protective Equipment (PPE)",
      "Regular Safety Inspections",
      "Incident Reporting Procedures",
      "Emergency Response Planning"
    ]
  },
  {
    id: "project-estimation",
    name: "Project Cost Estimation",
    icon: Icons.Calculator,
    shortDescription: "Precise and comprehensive cost estimation for construction and renovation projects",
    fullDescription: "Detailed and accurate cost estimation services that provide transparent and reliable financial projections for your construction projects.",
    serviceTypes: [
      "Residential Project Estimating",
      "Commercial Building Cost Analysis",
      "Renovation Budget Forecasting",
      "New Construction Financial Planning",
      "Remodeling Cost Projection",
      "Infrastructure Project Budgeting",
      "Material Quantity Takeoffs",
      "Labor Cost Projections",
      "Equipment Rental Estimates",
      "Value Engineering Consultation"
    ],
    keyBenefits: [
      "Accurate budget forecasting",
      "Reduced financial risks",
      "Transparent cost structure",
      "Optimized resource allocation",
      "Comprehensive financial planning",
      "Competitive pricing strategies",
      "Detailed cost breakdown"
    ],
    recommendedFor: [
      "Construction Companies",
      "Real Estate Developers",
      "Architectural Firms",
      "Property Owners",
      "Government Projects",
      "Homeowners",
      "Commercial Property Managers"
    ],
    priceRange: "$1,500 - $50,000",
    preparationSteps: [
      "Project scope review",
      "Comprehensive site inspection",
      "Material and labor market analysis",
      "Historical data comparison",
      "Detailed documentation gathering",
      "Technology and software cost assessment",
      "Contingency planning"
    ],
    aftercareTips: [
      "Regular cost tracking",
      "Update estimates with changing market conditions",
      "Maintain detailed financial records",
      "Conduct post-project cost analysis",
      "Review and optimize future estimating processes"
    ],
    industryStandards: [
      "AACE International Recommended Practices",
      "Construction Specifications Institute (CSI) Guidelines",
      "Generally Accepted Estimating Practices",
      "National Estimator Certification Standards"
    ],
    safetyProtocols: [
      "Confidential Information Handling",
      "Ethical Pricing Practices",
      "Transparent Reporting",
      "Conflict of Interest Avoidance",
      "Data Security Measures"
    ]
  },
  {
    id: "site-surveying",
    name: "Site Surveying and Mapping",
    icon: Icons.Map,
    shortDescription: "Comprehensive land surveying and mapping services for construction and development projects",
    fullDescription: "Professional site surveying services providing precise topographical, boundary, and environmental mapping for informed project planning.",
    serviceTypes: [
      "Residential Property Surveying",
      "Commercial Land Assessment",
      "Boundary Mapping",
      "Topographical Surveys",
      "Elevation Mapping",
      "Underground Utility Mapping",
      "Environmental Impact Assessment",
      "Drone Aerial Mapping",
      "3D Terrain Modeling",
      "GPS Precision Mapping",
      "Legal Boundary Determination",
      "Flood Zone Mapping"
    ],
    keyBenefits: [
      "Accurate site understanding",
      "Reduced project risks",
      "Compliance with zoning regulations",
      "Detailed environmental insights",
      "Precise planning capabilities",
      "Advanced mapping technologies",
      "Legal and regulatory compliance"
    ],
    recommendedFor: [
      "Construction Companies",
      "Real Estate Developers",
      "Municipal Governments",
      "Infrastructure Projects",
      "Environmental Agencies",
      "Property Buyers",
      "Land Development Firms"
    ],
    priceRange: "$2,000 - $75,000",
    preparationSteps: [
      "Initial site consultation",
      "Research of existing records",
      "Equipment and technology preparation",
      "Comprehensive site access coordination",
      "Preliminary data collection",
      "Historical land use investigation",
      "Regulatory compliance review"
    ],
    aftercareTips: [
      "Preserve survey documentation",
      "Update maps with future changes",
      "Integrate findings with project planning",
      "Maintain digital and physical records",
      "Conduct periodic re-surveys"
    ],
    industryStandards: [
      "ALTA/NSPS Land Title Surveys",
      "State Licensing Requirements",
      "FEMA Flood Mapping Guidelines",
      "National Geodetic Survey Standards"
    ],
    safetyProtocols: [
      "Personal Safety Equipment",
      "Site Access Safety Procedures",
      "Environmental Protection Measures",
      "Data Security Protocols",
      "Confidential Information Management"
    ]
  },
  {
    id: "permit-management",
    name: "Permit and Regulatory Compliance",
    icon: Icons.Document,
    shortDescription: "Comprehensive permit acquisition and regulatory compliance services for construction projects",
    fullDescription: "Expert navigation of complex permitting processes, ensuring smooth regulatory compliance for residential, commercial, and infrastructure projects.",
    serviceTypes: [
      "Residential Building Permits",
      "Commercial Construction Permits",
      "Zoning Compliance Consultation",
      "Environmental Permit Acquisition",
      "Historic Preservation Approvals",
      "Renovation Permit Processing",
      "Utility Connection Permits",
      "Safety Compliance Certification",
      "Architectural Review Board Submissions",
      "Specialized Permit Tracking"
    ],
    keyBenefits: [
      "Streamlined permit acquisition",
      "Reduced regulatory risks",
      "Expert regulatory navigation",
      "Time and cost savings",
      "Comprehensive compliance management",
      "Proactive problem resolution",
      "Detailed documentation support"
    ],
    recommendedFor: [
      "Property Developers",
      "Construction Companies",
      "Homeowners",
      "Renovation Contractors",
      "Commercial Property Managers",
      "Architectural Firms",
      "Municipal Project Managers"
    ],
    priceRange: "$1,000 - $25,000",
    preparationSteps: [
      "Initial project assessment",
      "Comprehensive regulatory research",
      "Permit requirement identification",
      "Documentation preparation",
      "Stakeholder communication",
      "Submission strategy development",
      "Compliance gap analysis"
    ],
    aftercareTips: [
      "Maintain detailed permit records",
      "Track permit expiration dates",
      "Conduct regular compliance audits",
      "Update documentation as needed",
      "Prepare for potential inspections"
    ],
    industryStandards: [
      "Local Municipal Codes",
      "State Building Regulations",
      "Federal Construction Guidelines",
      "ADA Accessibility Standards"
    ],
    safetyProtocols: [
      "Confidential Information Handling",
      "Transparent Communication",
      "Ethical Compliance Practices",
      "Continuous Regulatory Monitoring",
      "Data Privacy Protection"
    ]
  }
];
