export interface Service {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  priceRange: string;
  features: string[];
  benefits: string[];
  imageUrl?: string;
  category: 'residential' | 'commercial' | 'both';
}

export const services: Record<string, Service[]> = {
  contractor: [
    {
      id: 'renovation',
      name: 'Renovation Services',
      shortDescription: 'Complete home renovation and remodeling services',
      longDescription: 'Transform your space with our comprehensive renovation services. From kitchen and bathroom remodels to whole-house renovations.',
      priceRange: 'From $5,000',
      features: [
        'Kitchen remodeling',
        'Bathroom renovations',
        'Basement finishing',
        'Room additions',
        'Interior redesign'
      ],
      benefits: [
        'Increased property value',
        'Modern, updated spaces',
        'Energy-efficient upgrades',
        'Custom design options'
      ],
      category: 'both'
    },
    {
      id: 'construction',
      name: 'Construction Services',
      shortDescription: 'New construction and building services',
      longDescription: 'Expert construction services for new builds, additions, and major structural work.',
      priceRange: 'From $10,000',
      features: [
        'New home construction',
        'Commercial building',
        'Structural modifications',
        'Foundation work',
        'Project management'
      ],
      benefits: [
        'Quality craftsmanship',
        'On-time completion',
        'Building code compliance',
        'Professional oversight'
      ],
      category: 'both'
    },
    {
      id: 'repair',
      name: 'Repair Services',
      shortDescription: 'General repair and maintenance services',
      longDescription: 'Professional repair and maintenance services to keep your property in top condition.',
      priceRange: 'From $200',
      features: [
        'Structural repairs',
        'Drywall repair',
        'Flooring repair',
        'Door and window repair',
        'General maintenance'
      ],
      benefits: [
        'Fast response times',
        'Quality materials',
        'Expert technicians',
        'Warranty coverage'
      ],
      category: 'both'
    }
  ],
  appliance: [
    {
      id: 'repair',
      name: 'Appliance Repair',
      shortDescription: 'Expert repair services for all major appliances',
      longDescription: 'Professional repair services for refrigerators, washers, dryers, dishwashers, and more.',
      priceRange: 'From $89',
      features: [
        'Same-day service',
        'All major brands',
        'Genuine parts',
        'Diagnostic testing',
        'Maintenance plans'
      ],
      benefits: [
        'Extended appliance life',
        'Cost-effective solutions',
        'Expert technicians',
        'Warranty coverage'
      ],
      category: 'both'
    },
    {
      id: 'maintenance',
      name: 'Preventive Maintenance',
      shortDescription: 'Regular maintenance to prevent breakdowns',
      longDescription: 'Keep your appliances running efficiently with our preventive maintenance services.',
      priceRange: 'From $149',
      features: [
        'Regular inspections',
        'Performance tuning',
        'Parts replacement',
        'Safety checks',
        'Efficiency optimization'
      ],
      benefits: [
        'Prevent breakdowns',
        'Lower energy costs',
        'Extended lifespan',
        'Peace of mind'
      ],
      category: 'both'
    }
  ],
  hvac: [
    {
      id: 'installation',
      name: 'HVAC Installation',
      shortDescription: 'Professional HVAC system installation',
      longDescription: 'Expert installation of heating, ventilation, and air conditioning systems for optimal comfort.',
      priceRange: 'From $3,000',
      features: [
        'System design',
        'Professional installation',
        'Energy efficiency',
        'Smart thermostats',
        'Zoning systems'
      ],
      benefits: [
        'Energy savings',
        'Improved comfort',
        'Modern technology',
        'Extended warranty'
      ],
      category: 'both'
    },
    {
      id: 'maintenance',
      name: 'HVAC Maintenance',
      shortDescription: 'Regular maintenance for optimal performance',
      longDescription: 'Keep your HVAC system running efficiently with our comprehensive maintenance services.',
      priceRange: 'From $129',
      features: [
        'System inspection',
        'Filter replacement',
        'Coil cleaning',
        'Performance testing',
        'Safety checks'
      ],
      benefits: [
        'Lower energy bills',
        'Prevent breakdowns',
        'Extended system life',
        'Improved air quality'
      ],
      category: 'both'
    }
  ]
};
