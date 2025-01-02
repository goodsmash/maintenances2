export interface PricingTier {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  features: string[];
}

export interface ServicePricing {
  serviceId: string;
  basePriceRange: {
    min: number;
    max: number;
  };
  pricingFactors: PricingFactor[];
  additionalServices: AdditionalService[];
}

export interface PricingFactor {
  name: string;
  multiplier: number;
  description: string;
}

export interface AdditionalService {
  name: string;
  price: number;
  description: string;
}

export const pricingTiers: PricingTier[] = [
  {
    id: 'basic',
    name: 'Basic Service',
    description: 'Essential service package for simple repairs and maintenance',
    basePrice: 75,
    features: [
      'Standard diagnostic fee',
      'Basic repairs',
      'Standard parts',
      '30-day warranty'
    ]
  },
  {
    id: 'premium',
    name: 'Premium Service',
    description: 'Enhanced service package with priority scheduling',
    basePrice: 125,
    features: [
      'Priority scheduling',
      'Extended diagnostic',
      'Premium parts',
      '90-day warranty',
      'Follow-up inspection'
    ]
  },
  {
    id: 'comprehensive',
    name: 'Comprehensive Service',
    description: 'Complete service package with maximum coverage',
    basePrice: 200,
    features: [
      'Same-day service',
      'Complete diagnostic',
      'Premium parts',
      '1-year warranty',
      'Preventive maintenance',
      '24/7 support',
      'Annual inspection'
    ]
  }
];

export const servicePricing: ServicePricing[] = [
  {
    serviceId: 'plumbing',
    basePriceRange: {
      min: 75,
      max: 500
    },
    pricingFactors: [
      {
        name: 'Emergency Service',
        multiplier: 1.5,
        description: 'Additional fee for after-hours or emergency services'
      },
      {
        name: 'Location Premium',
        multiplier: 1.25,
        description: 'Additional fee for services in premium locations'
      }
    ],
    additionalServices: [
      {
        name: 'Camera Inspection',
        price: 150,
        description: 'Detailed pipe inspection using camera technology'
      },
      {
        name: 'Hydro Jetting',
        price: 350,
        description: 'High-pressure water cleaning of pipes'
      }
    ]
  },
  {
    serviceId: 'hvac',
    basePriceRange: {
      min: 100,
      max: 800
    },
    pricingFactors: [
      {
        name: 'System Size',
        multiplier: 1.3,
        description: 'Additional fee for larger HVAC systems'
      },
      {
        name: 'Emergency Service',
        multiplier: 1.5,
        description: 'Additional fee for after-hours or emergency services'
      }
    ],
    additionalServices: [
      {
        name: 'Duct Cleaning',
        price: 299,
        description: 'Complete cleaning of all ductwork'
      },
      {
        name: 'UV Light Installation',
        price: 250,
        description: 'Installation of UV light for air purification'
      }
    ]
  }
];

export const calculateServicePrice = (
  basePrice: number,
  factors: PricingFactor[],
  additionalServices: string[]
): number => {
  let finalPrice = basePrice;

  // Apply pricing factors
  factors.forEach(factor => {
    finalPrice *= factor.multiplier;
  });

  // Add additional services
  additionalServices.forEach(serviceId => {
    const service = servicePricing
      .flatMap(sp => sp.additionalServices)
      .find(as => as.name === serviceId);
    if (service) {
      finalPrice += service.price;
    }
  });

  return Math.round(finalPrice);
};
