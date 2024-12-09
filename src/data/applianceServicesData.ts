import { Icons } from "@/components/Icons";

export interface ApplianceService {
  id: string;
  name: string;
  icon: React.ComponentType;
  description: string;
  keyBenefits: string[];
  repairTypes: string[];
  priceRange: string;
}

export const applianceServices: ApplianceService[] = [
  {
    id: "refrigerator-repair",
    name: "Refrigerator Repair",
    icon: Icons.Fridge,
    description: "Comprehensive diagnosis and repair for all refrigerator types and brands.",
    keyBenefits: [
      "Same-day emergency service",
      "Certified technicians",
      "Warranty on repairs",
      "All major brands supported"
    ],
    repairTypes: [
      "Cooling issues",
      "Ice maker repairs",
      "Compressor replacement",
      "Door seal repairs",
      "Electronic control board fixes"
    ],
    priceRange: "$150 - $500"
  },
  {
    id: "washer-dryer-repair",
    name: "Washer & Dryer Repair",
    icon: Icons.Washing,
    description: "Expert repair services for washing machines and dryers of all models.",
    keyBenefits: [
      "Quick turnaround times",
      "Diagnostic fee applied to repair",
      "Parts warranty",
      "Energy efficiency optimization"
    ],
    repairTypes: [
      "Spin cycle issues",
      "Drum motor replacement",
      "Heating element repairs",
      "Water inlet valve fixes",
      "Electronic control repairs"
    ],
    priceRange: "$200 - $450"
  },
  {
    id: "dishwasher-repair",
    name: "Dishwasher Repair",
    icon: Icons.Dishwasher,
    description: "Professional repair and maintenance for all dishwasher brands and models.",
    keyBenefits: [
      "Leak detection and prevention",
      "Spray arm and pump repairs",
      "Sanitization system checks",
      "Energy-efficient solutions"
    ],
    repairTypes: [
      "Drainage problems",
      "Spray arm replacements",
      "Pump motor repairs",
      "Control panel fixes",
      "Water inlet valve repairs"
    ],
    priceRange: "$180 - $400"
  },
  {
    id: "oven-stove-repair",
    name: "Oven & Stove Repair",
    icon: Icons.Stove,
    description: "Comprehensive repair services for gas and electric ovens and stoves.",
    keyBenefits: [
      "Gas and electric specialists",
      "Safety inspection included",
      "Burner and element replacements",
      "Precise temperature calibration"
    ],
    repairTypes: [
      "Burner malfunction",
      "Temperature sensor repairs",
      "Ignition system fixes",
      "Control board replacements",
      "Heating element repairs"
    ],
    priceRange: "$200 - $550"
  },
  {
    id: "microwave-repair",
    name: "Microwave Repair",
    icon: Icons.Microwave,
    description: "Quick and reliable microwave repair for residential and commercial units.",
    keyBenefits: [
      "Fast diagnostic service",
      "All brands serviced",
      "Magnetron replacements",
      "Electrical system checks"
    ],
    repairTypes: [
      "Turntable issues",
      "Magnetron replacements",
      "Door switch repairs",
      "Control panel fixes",
      "Power supply repairs"
    ],
    priceRange: "$100 - $300"
  }
];
