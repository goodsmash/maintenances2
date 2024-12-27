import { Icons } from "@/components/Icons";

export interface CommercialServiceCategory {
  id: string;
  name: string;
  icon: React.ComponentType<{className?: string}>;
  shortDescription: string;
  fullDescription: string;
  keyServices: string[];
  benefits: string[];
  industries: string[];
  priceRange: string;
}

export const commercialServiceCategories: CommercialServiceCategory[] = [
  {
    id: "commercial-plumbing",
    name: "Commercial Plumbing",
    icon: Icons.Plumbing,
    shortDescription: "Comprehensive plumbing solutions for commercial properties",
    fullDescription: "Our commercial plumbing services provide expert maintenance, repair, and installation for businesses of all sizes. We specialize in complex plumbing systems, ensuring minimal disruption to your operations.",
    keyServices: [
      "Pipe repair and replacement",
      "Drain cleaning and unclogging",
      "Water heater services",
      "Backflow prevention",
      "Leak detection and repair",
      "Fixture installation"
    ],
    benefits: [
      "Rapid response times",
      "Advanced diagnostic technologies",
      "Minimal business interruption",
      "Comprehensive system assessments"
    ],
    industries: [
      "Restaurants", 
      "Hospitals", 
      "Hotels", 
      "Manufacturing", 
      "Educational Institutions"
    ],
    priceRange: "$300 - $5,000"
  },
  {
    id: "commercial-hvac",
    name: "Commercial HVAC",
    icon: Icons.Climate,
    shortDescription: "Professional HVAC solutions for business environments",
    fullDescription: "Our commercial HVAC services ensure optimal climate control and energy efficiency for your business. From installation to maintenance, we provide comprehensive solutions tailored to your specific needs.",
    keyServices: [
      "HVAC system installation",
      "Preventive maintenance",
      "Emergency repairs",
      "Energy efficiency audits",
      "Ductwork cleaning and repair",
      "Temperature control optimization"
    ],
    benefits: [
      "24/7 emergency service",
      "Energy cost reduction",
      "Improved air quality",
      "Extended equipment lifespan"
    ],
    industries: [
      "Office Buildings", 
      "Retail Spaces", 
      "Warehouses", 
      "Healthcare Facilities", 
      "Educational Institutions"
    ],
    priceRange: "$500 - $10,000"
  },
  {
    id: "commercial-electrical",
    name: "Commercial Electrical",
    icon: Icons.Electrical,
    shortDescription: "Expert electrical services for commercial properties",
    fullDescription: "Our commercial electrical services provide comprehensive solutions for businesses, ensuring safety, compliance, and optimal electrical system performance.",
    keyServices: [
      "Electrical system upgrades",
      "Lighting installation",
      "Electrical safety inspections",
      "Backup generator services",
      "Electrical panel upgrades",
      "Wiring and rewiring"
    ],
    benefits: [
      "Licensed and insured technicians",
      "Compliance with safety regulations",
      "Minimal business disruption",
      "Advanced diagnostic technologies"
    ],
    industries: [
      "Manufacturing", 
      "Hospitality", 
      "Retail", 
      "Corporate Offices", 
      "Healthcare"
    ],
    priceRange: "$400 - $7,500"
  },
  {
    id: "commercial-construction",
    name: "Commercial Construction",
    icon: Icons.Building,
    shortDescription: "Comprehensive construction services for commercial projects",
    fullDescription: "Our commercial construction services provide end-to-end solutions from initial design to final implementation, ensuring quality, efficiency, and compliance.",
    keyServices: [
      "Tenant improvements",
      "Renovation and remodeling",
      "Structural repairs",
      "Building extensions",
      "Interior build-outs",
      "Code compliance upgrades"
    ],
    benefits: [
      "Experienced project management",
      "Efficient timeline execution",
      "Cost-effective solutions",
      "Comprehensive design consultation"
    ],
    industries: [
      "Retail", 
      "Office Spaces", 
      "Healthcare", 
      "Educational Institutions", 
      "Hospitality"
    ],
    priceRange: "$5,000 - $500,000"
  },
  {
    id: "commercial-security",
    name: "Commercial Security",
    icon: Icons.Network,
    shortDescription: "Advanced security solutions for business protection",
    fullDescription: "Our commercial security services provide comprehensive protection through cutting-edge technologies and strategic security planning.",
    keyServices: [
      "Security system installation",
      "Access control systems",
      "Video surveillance",
      "Alarm monitoring",
      "Cybersecurity assessments",
      "Security consulting"
    ],
    benefits: [
      "24/7 monitoring",
      "Advanced threat detection",
      "Customized security strategies",
      "Rapid incident response"
    ],
    industries: [
      "Financial Services", 
      "Retail", 
      "Healthcare", 
      "Corporate Offices", 
      "Manufacturing"
    ],
    priceRange: "$1,000 - $25,000"
  },
  {
    id: "commercial-pest-control",
    name: "Commercial Pest Control",
    icon: Icons.Wrench,
    shortDescription: "Professional pest management for commercial environments",
    fullDescription: "Our commercial pest control services provide comprehensive solutions to protect your business from pest infestations, ensuring health and safety standards.",
    keyServices: [
      "Comprehensive pest inspections",
      "Targeted pest elimination",
      "Preventive treatment plans",
      "Sanitation consulting",
      "Ongoing maintenance",
      "Emergency pest response"
    ],
    benefits: [
      "Health code compliance",
      "Minimal business disruption",
      "Environmentally responsible solutions",
      "Customized treatment plans"
    ],
    industries: [
      "Restaurants", 
      "Food Processing", 
      "Healthcare", 
      "Hospitality", 
      "Retail"
    ],
    priceRange: "$300 - $5,000"
  },
  {
    id: "commercial-fire-safety",
    name: "Commercial Fire Safety",
    icon: Icons.Electrical,
    shortDescription: "Comprehensive fire safety and prevention services",
    fullDescription: "Our commercial fire safety services provide critical protection through advanced detection, suppression, and prevention technologies.",
    keyServices: [
      "Fire alarm system installation",
      "Sprinkler system maintenance",
      "Fire extinguisher services",
      "Emergency evacuation planning",
      "Compliance inspections",
      "Fire risk assessments"
    ],
    benefits: [
      "Regulatory compliance",
      "Life and property protection",
      "Advanced detection technologies",
      "Comprehensive safety training"
    ],
    industries: [
      "Manufacturing", 
      "Warehouses", 
      "Healthcare", 
      "Educational Institutions", 
      "Corporate Offices"
    ],
    priceRange: "$1,500 - $50,000"
  },
  {
    id: "commercial-kitchen",
    name: "Commercial Kitchen",
    icon: Icons.Stove,
    shortDescription: "Specialized maintenance for commercial kitchen environments",
    fullDescription: "Our commercial kitchen services provide comprehensive maintenance, repair, and optimization for food service equipment and spaces.",
    keyServices: [
      "Kitchen equipment repair",
      "Hood and ventilation cleaning",
      "Refrigeration maintenance",
      "Cooking equipment servicing",
      "Sanitation consulting",
      "Energy efficiency upgrades"
    ],
    benefits: [
      "Health code compliance",
      "Equipment longevity",
      "Operational efficiency",
      "Reduced downtime"
    ],
    industries: [
      "Restaurants", 
      "Catering Services", 
      "Hospitals", 
      "Schools", 
      "Hotels"
    ],
    priceRange: "$500 - $10,000"
  }
];
