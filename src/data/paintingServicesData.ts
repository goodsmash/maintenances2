import React from 'react';
import { Icons } from "@/components/Icons";

export interface PaintingService {
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
}

export const paintingServices: PaintingService[] = [
  {
    id: "interior-painting",
    name: "Interior Painting",
    icon: Icons.Paint,
    shortDescription: "Professional interior painting services for residential and commercial spaces",
    fullDescription: "Transform your interior spaces with our expert painting services. We provide meticulous preparation, precise application, and flawless finishes that breathe new life into your rooms.",
    serviceTypes: [
      "Living Room Painting",
      "Bedroom Repainting",
      "Kitchen Color Updates",
      "Accent Wall Creation",
      "Ceiling Painting",
      "Trim and Baseboard Painting",
      "Wallpaper Removal",
      "Drywall Repair and Preparation"
    ],
    keyBenefits: [
      "Professional color consultation",
      "High-quality, low-VOC paints",
      "Minimal disruption to your space",
      "Detailed surface preparation",
      "Clean and precise application"
    ],
    recommendedFor: [
      "Homeowners",
      "Rental Property Managers",
      "Office Spaces",
      "Commercial Interiors"
    ],
    priceRange: "$500 - $3,500",
    preparationSteps: [
      "Furniture moving and protection",
      "Surface cleaning and repair",
      "Priming of walls",
      "Taping and masking",
      "Protecting floors and fixtures"
    ],
    aftercareTips: [
      "Allow 24-48 hours for complete drying",
      "Avoid washing walls for 2 weeks",
      "Use gentle, non-abrasive cleaning methods"
    ]
  },
  {
    id: "exterior-painting",
    name: "Exterior Painting",
    icon: Icons.House,
    shortDescription: "Comprehensive exterior painting and protection services",
    fullDescription: "Enhance your property's curb appeal and protect it from environmental elements with our professional exterior painting solutions.",
    serviceTypes: [
      "House Exterior Painting",
      "Trim and Accent Painting",
      "Deck and Fence Staining",
      "Garage Painting",
      "Siding Restoration",
      "Weatherproofing",
      "Color Consultation",
      "Surface Preparation"
    ],
    keyBenefits: [
      "Weather-resistant paint technologies",
      "UV and moisture protection",
      "Enhanced property value",
      "Professional color matching",
      "Long-lasting finish"
    ],
    recommendedFor: [
      "Homeowners",
      "Property Managers",
      "Real Estate Professionals",
      "Commercial Properties"
    ],
    priceRange: "$1,500 - $8,000",
    preparationSteps: [
      "Pressure washing",
      "Scraping and sanding",
      "Repair of wood rot or damage",
      "Priming surfaces",
      "Protecting landscaping"
    ],
    aftercareTips: [
      "Allow 48-72 hours for complete curing",
      "Inspect annually for touch-ups",
      "Clean surfaces gently to maintain finish"
    ]
  },
  {
    id: "commercial-painting",
    name: "Commercial Painting",
    icon: Icons.Building,
    shortDescription: "Professional painting solutions for businesses and commercial spaces",
    fullDescription: "Comprehensive painting services designed to meet the unique needs of commercial environments, ensuring professional appearance and durability.",
    serviceTypes: [
      "Office Repainting",
      "Retail Space Painting",
      "Warehouse Coating",
      "Industrial Facility Painting",
      "Restaurant Interior Design",
      "Healthcare Facility Painting",
      "Educational Institution Coloring",
      "Hospitality Space Refresh"
    ],
    keyBenefits: [
      "Minimal business disruption",
      "Compliance with industry standards",
      "Quick turnaround times",
      "Professional color consultation",
      "Specialized commercial-grade paints"
    ],
    recommendedFor: [
      "Corporate Offices",
      "Retail Businesses",
      "Restaurants",
      "Healthcare Facilities",
      "Educational Institutions"
    ],
    priceRange: "$2,000 - $15,000",
    preparationSteps: [
      "Comprehensive site assessment",
      "Detailed project scheduling",
      "Surface preparation",
      "Protection of equipment and fixtures",
      "Color and finish selection"
    ],
    aftercareTips: [
      "Follow recommended maintenance schedule",
      "Conduct periodic inspections",
      "Address any wear or damage promptly"
    ]
  },
  {
    id: "specialty-finishes",
    name: "Specialty Finishes",
    icon: Icons.Palette,
    shortDescription: "Unique and custom painting techniques for distinctive spaces",
    fullDescription: "Elevate your space with our specialty painting techniques, including textured finishes, murals, and decorative painting solutions.",
    serviceTypes: [
      "Textured Wall Treatments",
      "Metallic Finishes",
      "Faux Finish Techniques",
      "Mural Painting",
      "Decorative Accent Walls",
      "Venetian Plaster",
      "Ombre Effects",
      "Stenciling and Patterns"
    ],
    keyBenefits: [
      "Custom design consultation",
      "Artistic and unique approaches",
      "Personalized space transformation",
      "High-end finish options",
      "Expert craftsmanship"
    ],
    recommendedFor: [
      "Design Enthusiasts",
      "Luxury Homes",
      "Boutique Businesses",
      "Creative Spaces",
      "Art Galleries"
    ],
    priceRange: "$1,000 - $10,000",
    preparationSteps: [
      "Detailed design consultation",
      "Surface preparation",
      "Mockup and design approval",
      "Precision application techniques",
      "Quality control checks"
    ],
    aftercareTips: [
      "Use gentle cleaning methods",
      "Avoid harsh chemicals",
      "Touch up as needed to maintain finish"
    ]
  },
  {
    id: "industrial-coatings",
    name: "Industrial Coatings",
    icon: Icons.Factory,
    shortDescription: "Advanced protective coating solutions for industrial environments",
    fullDescription: "Specialized painting and coating services designed to protect, preserve, and enhance industrial and manufacturing spaces.",
    serviceTypes: [
      "Epoxy Floor Coating",
      "Anti-Corrosion Painting",
      "Chemical-Resistant Coatings",
      "High-Temperature Paint Systems",
      "Machinery Painting",
      "Warehouse Floor Sealing",
      "Protective Equipment Coating",
      "Rust Prevention Treatments"
    ],
    keyBenefits: [
      "Enhanced durability",
      "Chemical and wear resistance",
      "Improved safety markings",
      "Extended equipment lifespan",
      "Compliance with industry standards"
    ],
    recommendedFor: [
      "Manufacturing Facilities",
      "Warehouses",
      "Chemical Plants",
      "Food Processing Facilities",
      "Automotive Workshops"
    ],
    priceRange: "$3,000 - $25,000",
    preparationSteps: [
      "Comprehensive surface assessment",
      "Thorough surface preparation",
      "Chemical and environmental testing",
      "Specialized primer application",
      "Precision coating techniques"
    ],
    aftercareTips: [
      "Follow manufacturer's maintenance guidelines",
      "Conduct regular inspections",
      "Address any coating damage immediately"
    ]
  }
];
