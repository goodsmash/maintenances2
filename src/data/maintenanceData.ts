export interface MaintenanceIssue {
  title: string;
  description: string;
  symptoms: string[];
  severity: 'minor' | 'moderate' | 'severe' | 'emergency';
  estimatedCost: string;
  timeToFix: string;
}

export interface CategoryData {
  description: string;
  issues: MaintenanceIssue[];
}

export const severityColors: Record<string, string> = {
  minor: 'bg-blue-100 text-blue-800',
  moderate: 'bg-yellow-100 text-yellow-800',
  severe: 'bg-orange-100 text-orange-800',
  emergency: 'bg-red-100 text-red-800'
};

export const categories = [
  "electrical",
  "plumbing",
  "hvac",
  "roofing",
  "pest-control",
  "appliances",
  "carpentry",
  "flooring",
  "painting",
  "landscaping",
  "security",
  "cleaning",
  "restaurant-maintenance"
] as const;

export type CategoryType = typeof categories[number];

export const maintenanceData: Record<CategoryType, CategoryData> = {
  electrical: {
    description: "Comprehensive electrical services for residential and commercial properties",
    issues: [
      {
        title: "Power Outage",
        description: "Complete loss of electrical power in part or all of the property",
        symptoms: ["No electricity", "Partial power loss", "Flickering lights", "Tripped breakers"],
        severity: "severe",
        estimatedCost: "$150-$500",
        timeToFix: "2-4 hours"
      },
      {
        title: "Circuit Breaker Issues",
        description: "Problems with circuit breakers tripping or not functioning properly",
        symptoms: ["Frequent trips", "Won't reset", "Hot panel", "Burning smell"],
        severity: "moderate",
        estimatedCost: "$100-$300",
        timeToFix: "1-2 hours"
      },
      {
        title: "Faulty Outlets",
        description: "Electrical outlets not working or showing signs of damage",
        symptoms: ["No power", "Sparking", "Discoloration", "Loose plugs"],
        severity: "moderate",
        estimatedCost: "$75-$200",
        timeToFix: "1-2 hours"
      },
      {
        title: "Light Fixture Installation",
        description: "Installation of new light fixtures or replacement of old ones",
        symptoms: ["New installation needed", "Old fixture broken", "Outdated fixtures", "Poor lighting"],
        severity: "minor",
        estimatedCost: "$50-$150",
        timeToFix: "1-2 hours"
      },
      {
        title: "Ceiling Fan Wiring",
        description: "Installation or repair of ceiling fan electrical connections",
        symptoms: ["Wobbling fan", "No power", "Speed control issues", "Remote not working"],
        severity: "minor",
        estimatedCost: "$100-$250",
        timeToFix: "2-3 hours"
      },
      {
        title: "Exposed Wiring",
        description: "Repair of exposed or damaged electrical wiring",
        symptoms: ["Visible wires", "Electrical shocks", "Fire hazard", "Code violations"],
        severity: "severe",
        estimatedCost: "$200-$600",
        timeToFix: "3-6 hours"
      },
      {
        title: "GFCI Outlet Installation",
        description: "Installation of ground fault circuit interrupter outlets in wet areas",
        symptoms: ["No GFCI protection", "Code compliance needed", "Safety concerns", "Outdated outlets"],
        severity: "minor",
        estimatedCost: "$75-$200",
        timeToFix: "1-2 hours"
      },
      {
        title: "Electrical Panel Upgrade",
        description: "Upgrade of main electrical panel for increased capacity",
        symptoms: ["Insufficient power", "Frequent trips", "Old panel", "Limited circuits"],
        severity: "severe",
        estimatedCost: "$1,500-$4,000",
        timeToFix: "6-12 hours"
      },
      {
        title: "Recessed Lighting Installation",
        description: "Installation of new recessed lighting fixtures",
        symptoms: ["Poor lighting", "Outdated fixtures", "Renovation needs", "Energy efficiency upgrade"],
        severity: "minor",
        estimatedCost: "$300-$1,000",
        timeToFix: "4-8 hours"
      },
      {
        title: "Outdoor Lighting Repair",
        description: "Repair or replacement of outdoor lighting systems",
        symptoms: ["Non-functional lights", "Damaged wiring", "Poor illumination", "Safety concerns"],
        severity: "moderate",
        estimatedCost: "$100-$300",
        timeToFix: "1-3 hours"
      },
      {
        title: "EV Charger Installation",
        description: "Installation of electric vehicle charging station",
        symptoms: ["New EV purchase", "Charging needs", "Garage preparation", "Electrical capacity check"],
        severity: "moderate",
        estimatedCost: "$500-$2,000",
        timeToFix: "4-8 hours"
      },
      {
        title: "Surge Protection Installation",
        description: "Whole-house surge protection system installation",
        symptoms: ["Equipment damage", "Power fluctuations", "Lightning concerns", "Electronics protection"],
        severity: "moderate",
        estimatedCost: "$300-$800",
        timeToFix: "2-4 hours"
      },
      {
        title: "Generator Installation",
        description: "Installation of backup power generator system",
        symptoms: ["Power reliability needs", "Emergency backup", "Business continuity", "Medical equipment"],
        severity: "moderate",
        estimatedCost: "$3,000-$10,000",
        timeToFix: "8-16 hours"
      },
      {
        title: "Smart Home Wiring",
        description: "Installation of smart home electrical systems",
        symptoms: ["Home automation needs", "Smart device integration", "Wireless issues", "Control requirements"],
        severity: "minor",
        estimatedCost: "$200-$1,000",
        timeToFix: "2-8 hours"
      },
      {
        title: "Electrical Troubleshooting",
        description: "Diagnostic services for electrical issues",
        symptoms: ["Unknown problems", "Intermittent issues", "Strange noises", "Burning smells"],
        severity: "moderate",
        estimatedCost: "$100-$300",
        timeToFix: "1-4 hours"
      }
    ]
  },
  plumbing: {
    description: "Expert plumbing services for all types of water and drainage systems",
    issues: [
      {
        title: "Burst Pipe",
        description: "Emergency repair of burst water pipes and water damage mitigation",
        symptoms: ["Water spraying", "Flooding", "Water stains", "Low pressure"],
        severity: "emergency",
        estimatedCost: "$500-$2000",
        timeToFix: "2-6 hours"
      },
      {
        title: "Clogged Drain",
        description: "Professional drain cleaning and clog removal services",
        symptoms: ["Slow drainage", "Standing water", "Gurgling sounds", "Bad odors"],
        severity: "moderate",
        estimatedCost: "$100-$300",
        timeToFix: "1-2 hours"
      },
      {
        title: "Water Heater Repair",
        description: "Diagnosis and repair of water heater issues",
        symptoms: ["No hot water", "Strange noises", "Leaking", "Rusty water"],
        severity: "severe",
        estimatedCost: "$300-$1200",
        timeToFix: "2-4 hours"
      },
      {
        title: "Toilet Repair",
        description: "Fixing common toilet problems and replacements",
        symptoms: ["Running water", "Weak flush", "Leaking base", "Clogged bowl"],
        severity: "moderate",
        estimatedCost: "$150-$500",
        timeToFix: "1-3 hours"
      },
      {
        title: "Sewer Line Backup",
        description: "Clearing and repair of main sewer line blockages",
        symptoms: ["Multiple drain clogs", "Sewage smell", "Gurgling toilets", "Yard pooling"],
        severity: "emergency",
        estimatedCost: "$300-$5000",
        timeToFix: "4-12 hours"
      },
      {
        title: "Faucet Installation",
        description: "Installation or replacement of kitchen and bathroom faucets",
        symptoms: ["Leaking faucet", "Low pressure", "Broken handle", "Outdated fixture"],
        severity: "minor",
        estimatedCost: "$150-$400",
        timeToFix: "1-2 hours"
      },
      {
        title: "Garbage Disposal Repair",
        description: "Repair or replacement of kitchen garbage disposal units",
        symptoms: ["Won't turn on", "Humming sound", "Leaking", "Clogged unit"],
        severity: "moderate",
        estimatedCost: "$150-$500",
        timeToFix: "1-3 hours"
      },
      {
        title: "Sump Pump Service",
        description: "Maintenance and repair of basement sump pump systems",
        symptoms: ["Pump not working", "Frequent cycling", "Strange noises", "Basement flooding"],
        severity: "severe",
        estimatedCost: "$400-$1000",
        timeToFix: "2-4 hours"
      },
      {
        title: "Water Softener Installation",
        description: "Installation and setup of water softening systems",
        symptoms: ["Hard water", "Scale buildup", "Soap inefficiency", "Spotty dishes"],
        severity: "minor",
        estimatedCost: "$800-$2500",
        timeToFix: "4-6 hours"
      },
      {
        title: "Gas Line Installation",
        description: "Installation and repair of gas lines for appliances",
        symptoms: ["Gas smell", "New appliance needs", "Leaking connection", "Code compliance"],
        severity: "severe",
        estimatedCost: "$500-$2000",
        timeToFix: "4-8 hours"
      },
      {
        title: "Leak Detection",
        description: "Professional detection and location of hidden water leaks",
        symptoms: ["High water bill", "Damp spots", "Mold growth", "Water sounds"],
        severity: "moderate",
        estimatedCost: "$200-$800",
        timeToFix: "2-4 hours"
      },
      {
        title: "Pipe Insulation",
        description: "Insulation of water pipes for freeze protection",
        symptoms: ["Frozen pipes", "Cold water", "Energy loss", "Condensation"],
        severity: "moderate",
        estimatedCost: "$200-$1000",
        timeToFix: "2-6 hours"
      },
      {
        title: "Bathroom Remodel Plumbing",
        description: "Complete plumbing services for bathroom renovations",
        symptoms: ["Renovation needs", "Outdated fixtures", "Layout changes", "Code updates"],
        severity: "minor",
        estimatedCost: "$1500-$5000",
        timeToFix: "8-24 hours"
      },
      {
        title: "Water Filtration System",
        description: "Installation of whole-house water filtration systems",
        symptoms: ["Poor water quality", "Taste issues", "Sediment", "Health concerns"],
        severity: "minor",
        estimatedCost: "$600-$2000",
        timeToFix: "4-8 hours"
      },
      {
        title: "Backflow Prevention",
        description: "Installation and testing of backflow prevention devices",
        symptoms: ["Code requirement", "Water contamination", "Annual testing needed", "System upgrade"],
        severity: "moderate",
        estimatedCost: "$300-$1000",
        timeToFix: "2-4 hours"
      },
      {
        title: "Shower Installation",
        description: "Installation or replacement of shower systems",
        symptoms: ["Low pressure", "Leaking", "Outdated fixture", "Temperature issues"],
        severity: "moderate",
        estimatedCost: "$500-$2000",
        timeToFix: "4-8 hours"
      },
      {
        title: "Commercial Plumbing",
        description: "Comprehensive plumbing services for commercial properties",
        symptoms: ["System failures", "Code compliance", "Capacity issues", "Maintenance needs"],
        severity: "severe",
        estimatedCost: "$1000-$10000",
        timeToFix: "4-48 hours"
      },
      {
        title: "Drain Camera Inspection",
        description: "Video inspection of drain and sewer lines",
        symptoms: ["Recurring clogs", "Slow drains", "Root intrusion", "Line damage"],
        severity: "moderate",
        estimatedCost: "$200-$800",
        timeToFix: "1-3 hours"
      },
      {
        title: "Water Pressure Regulation",
        description: "Installation and adjustment of water pressure regulators",
        symptoms: ["High pressure", "Pipe noise", "Fixture damage", "System stress"],
        severity: "moderate",
        estimatedCost: "$200-$600",
        timeToFix: "1-3 hours"
      },
      {
        title: "Emergency Plumbing",
        description: "24/7 emergency plumbing response services",
        symptoms: ["Flooding", "No water", "Major leaks", "Sewage backup"],
        severity: "emergency",
        estimatedCost: "$200-$1500",
        timeToFix: "1-6 hours"
      }
    ]
  },
  hvac: {
    description: "Complete heating, ventilation, and air conditioning services",
    issues: [
      {
        title: "AC Not Cooling",
        description: "Diagnosis and repair of air conditioning cooling issues",
        symptoms: ["Warm air", "Poor airflow", "Strange noises", "High energy bills"],
        severity: "severe",
        estimatedCost: "$200-$800",
        timeToFix: "2-4 hours"
      },
      {
        title: "Heating System Failure",
        description: "Repair of heating system components and full system failures",
        symptoms: ["No heat", "Cold spots", "System won't start", "Unusual noises"],
        severity: "severe",
        estimatedCost: "$300-$1000",
        timeToFix: "2-6 hours"
      },
      {
        title: "Annual HVAC Maintenance",
        description: "Comprehensive yearly maintenance and inspection",
        symptoms: ["Routine service", "Efficiency check", "Performance issues", "Preventive care"],
        severity: "minor",
        estimatedCost: "$150-$300",
        timeToFix: "1-2 hours"
      },
      {
        title: "Ductwork Cleaning",
        description: "Professional cleaning of HVAC duct systems",
        symptoms: ["Poor air quality", "Dust", "Allergies", "Odors"],
        severity: "moderate",
        estimatedCost: "$300-$1000",
        timeToFix: "3-6 hours"
      },
      {
        title: "Thermostat Installation",
        description: "Installation and programming of new thermostats",
        symptoms: ["Outdated control", "Temperature issues", "Smart home upgrade", "Energy savings"],
        severity: "minor",
        estimatedCost: "$150-$400",
        timeToFix: "1-2 hours"
      },
      {
        title: "Furnace Repair",
        description: "Diagnosis and repair of furnace issues",
        symptoms: ["No heat", "Strange sounds", "Pilot light issues", "Short cycling"],
        severity: "severe",
        estimatedCost: "$200-$1200",
        timeToFix: "2-4 hours"
      },
      {
        title: "Heat Pump Service",
        description: "Maintenance and repair of heat pump systems",
        symptoms: ["Poor heating/cooling", "Ice buildup", "System cycling", "Noise"],
        severity: "moderate",
        estimatedCost: "$200-$600",
        timeToFix: "2-4 hours"
      },
      {
        title: "Air Handler Repair",
        description: "Service and repair of air handler units",
        symptoms: ["Poor airflow", "Noise", "Water leaks", "System inefficiency"],
        severity: "moderate",
        estimatedCost: "$300-$1000",
        timeToFix: "2-5 hours"
      },
      {
        title: "New HVAC Installation",
        description: "Complete installation of new HVAC systems",
        symptoms: ["Old system", "Major repairs needed", "Efficiency upgrade", "Home renovation"],
        severity: "minor",
        estimatedCost: "$5000-$15000",
        timeToFix: "8-16 hours"
      },
      {
        title: "Emergency HVAC Service",
        description: "24/7 emergency HVAC repair services",
        symptoms: ["No heat/cooling", "System failure", "Safety concerns", "Extreme weather"],
        severity: "emergency",
        estimatedCost: "$300-$1000",
        timeToFix: "1-4 hours"
      },
      {
        title: "Refrigerant Leak Repair",
        description: "Detection and repair of refrigerant leaks",
        symptoms: ["Poor cooling", "Ice buildup", "High bills", "System inefficiency"],
        severity: "severe",
        estimatedCost: "$200-$1500",
        timeToFix: "2-6 hours"
      },
      {
        title: "Zone System Installation",
        description: "Installation of HVAC zoning systems",
        symptoms: ["Temperature variation", "Comfort issues", "Energy waste", "Control needs"],
        severity: "minor",
        estimatedCost: "$2000-$5000",
        timeToFix: "6-12 hours"
      },
      {
        title: "Commercial HVAC Service",
        description: "Comprehensive commercial HVAC maintenance and repair",
        symptoms: ["System inefficiency", "Comfort complaints", "High costs", "Code compliance"],
        severity: "severe",
        estimatedCost: "$500-$5000",
        timeToFix: "4-24 hours"
      },
      {
        title: "Air Quality Solutions",
        description: "Installation of air purification and filtration systems",
        symptoms: ["Poor air quality", "Allergies", "Health concerns", "Odors"],
        severity: "moderate",
        estimatedCost: "$500-$2000",
        timeToFix: "2-6 hours"
      },
      {
        title: "Ductwork Repair",
        description: "Repair and sealing of ductwork",
        symptoms: ["Air leaks", "Poor airflow", "High bills", "Uneven heating/cooling"],
        severity: "moderate",
        estimatedCost: "$300-$1000",
        timeToFix: "2-6 hours"
      },
      {
        title: "Boiler Service",
        description: "Maintenance and repair of boiler systems",
        symptoms: ["No heat", "Strange noises", "Leaks", "Pressure issues"],
        severity: "severe",
        estimatedCost: "$200-$1000",
        timeToFix: "2-6 hours"
      },
      {
        title: "Mini-Split Installation",
        description: "Installation of ductless mini-split systems",
        symptoms: ["Zone cooling needs", "No ductwork", "Renovation", "Efficiency upgrade"],
        severity: "minor",
        estimatedCost: "$2000-$7000",
        timeToFix: "4-8 hours"
      },
      {
        title: "UV Light Installation",
        description: "Installation of UV air purification systems",
        symptoms: ["Air quality concerns", "Mold issues", "Health needs", "System upgrade"],
        severity: "minor",
        estimatedCost: "$400-$1000",
        timeToFix: "2-4 hours"
      },
      {
        title: "Ventilation Assessment",
        description: "Evaluation and improvement of ventilation systems",
        symptoms: ["Poor air circulation", "Stuffiness", "Moisture issues", "Code compliance"],
        severity: "moderate",
        estimatedCost: "$200-$600",
        timeToFix: "1-3 hours"
      },
      {
        title: "Energy Efficiency Audit",
        description: "Comprehensive HVAC system efficiency evaluation",
        symptoms: ["High bills", "Performance issues", "Comfort concerns", "Upgrade planning"],
        severity: "minor",
        estimatedCost: "$200-$500",
        timeToFix: "2-4 hours"
      }
    ]
  },
  roofing: {
    description: "Professional roofing services for all types of structures",
    issues: [
      {
        title: "Roof Leak Repair",
        description: "Emergency repair of active roof leaks and water damage",
        symptoms: ["Water stains", "Dripping water", "Ceiling damage", "Mold growth"],
        severity: "severe",
        estimatedCost: "$300-$1000",
        timeToFix: "2-4 hours"
      },
      {
        title: "Missing Shingles",
        description: "Replacement of missing or damaged roof shingles",
        symptoms: ["Visible gaps", "Shingles in yard", "Wind damage", "Water penetration"],
        severity: "moderate",
        estimatedCost: "$200-$600",
        timeToFix: "1-3 hours"
      },
      {
        title: "Complete Roof Replacement",
        description: "Full replacement of existing roof system",
        symptoms: ["Age-related wear", "Multiple leaks", "Storm damage", "Poor energy efficiency"],
        severity: "severe",
        estimatedCost: "$5000-$20000",
        timeToFix: "2-5 days"
      },
      {
        title: "Gutter Installation",
        description: "Installation of new gutter system and downspouts",
        symptoms: ["Water overflow", "Foundation issues", "Old gutters", "Poor drainage"],
        severity: "moderate",
        estimatedCost: "$600-$2000",
        timeToFix: "4-8 hours"
      },
      {
        title: "Chimney Repair",
        description: "Repair of chimney masonry and flashing",
        symptoms: ["Leaking", "Cracked masonry", "Loose flashing", "Deterioration"],
        severity: "severe",
        estimatedCost: "$500-$2500",
        timeToFix: "4-8 hours"
      },
      {
        title: "Skylight Installation",
        description: "Installation of new skylights or solar tubes",
        symptoms: ["Poor lighting", "Energy efficiency", "Home improvement", "Natural light needs"],
        severity: "minor",
        estimatedCost: "$1000-$3000",
        timeToFix: "4-8 hours"
      },
      {
        title: "Ventilation Improvement",
        description: "Installation or repair of roof ventilation systems",
        symptoms: ["Poor attic ventilation", "High energy bills", "Moisture buildup", "Ice dams"],
        severity: "moderate",
        estimatedCost: "$300-$1000",
        timeToFix: "2-4 hours"
      },
      {
        title: "Flat Roof Repair",
        description: "Repair of commercial or residential flat roofing",
        symptoms: ["Ponding water", "Bubbles", "Cracks", "Membrane damage"],
        severity: "severe",
        estimatedCost: "$500-$3000",
        timeToFix: "4-12 hours"
      },
      {
        title: "Emergency Tarp Service",
        description: "Temporary protection for storm-damaged roofs",
        symptoms: ["Storm damage", "Active leaks", "Missing sections", "Immediate protection needed"],
        severity: "emergency",
        estimatedCost: "$200-$1000",
        timeToFix: "1-3 hours"
      },
      {
        title: "Ice Dam Removal",
        description: "Removal of ice dams and prevention measures",
        symptoms: ["Ice buildup", "Icicles", "Water backup", "Interior leaks"],
        severity: "severe",
        estimatedCost: "$300-$1000",
        timeToFix: "2-6 hours"
      },
      {
        title: "Solar Panel Roof Prep",
        description: "Roof preparation and reinforcement for solar installation",
        symptoms: ["Solar installation plans", "Structural assessment", "Mounting needs", "Waterproofing"],
        severity: "minor",
        estimatedCost: "$1000-$3000",
        timeToFix: "4-8 hours"
      },
      {
        title: "Roof Inspection",
        description: "Comprehensive roof condition assessment",
        symptoms: ["Annual maintenance", "Pre-purchase inspection", "Storm damage check", "Warranty requirement"],
        severity: "minor",
        estimatedCost: "$200-$500",
        timeToFix: "1-2 hours"
      },
      {
        title: "Metal Roof Installation",
        description: "Installation of new metal roofing system",
        symptoms: ["Durability needs", "Energy efficiency", "Style preference", "Long-term investment"],
        severity: "minor",
        estimatedCost: "$10000-$30000",
        timeToFix: "3-7 days"
      },
      {
        title: "Roof Coating Application",
        description: "Application of protective roof coating systems",
        symptoms: ["UV damage", "Energy costs", "Leak prevention", "Life extension"],
        severity: "moderate",
        estimatedCost: "$1000-$4000",
        timeToFix: "4-8 hours"
      },
      {
        title: "Valley Repair",
        description: "Repair of roof valley deterioration",
        symptoms: ["Valley leaks", "Rust", "Debris buildup", "Water channeling issues"],
        severity: "severe",
        estimatedCost: "$400-$1200",
        timeToFix: "2-4 hours"
      },
      {
        title: "Fascia and Soffit Repair",
        description: "Repair or replacement of fascia and soffit",
        symptoms: ["Rotting wood", "Animal entry", "Ventilation issues", "Visual deterioration"],
        severity: "moderate",
        estimatedCost: "$300-$1200",
        timeToFix: "2-6 hours"
      },
      {
        title: "Commercial Roof Maintenance",
        description: "Preventive maintenance for commercial roofing",
        symptoms: ["Regular upkeep", "Warranty compliance", "Preventive care", "System longevity"],
        severity: "minor",
        estimatedCost: "$500-$2000",
        timeToFix: "2-8 hours"
      },
      {
        title: "Storm Damage Assessment",
        description: "Inspection and documentation of storm-related damage",
        symptoms: ["Recent storms", "Visible damage", "Insurance claims", "Repair planning"],
        severity: "moderate",
        estimatedCost: "$200-$500",
        timeToFix: "1-2 hours"
      },
      {
        title: "Green Roof Installation",
        description: "Installation of vegetative roof systems",
        symptoms: ["Environmental goals", "Energy efficiency", "Aesthetic desire", "Stormwater management"],
        severity: "minor",
        estimatedCost: "$15000-$50000",
        timeToFix: "5-14 days"
      },
      {
        title: "Emergency Leak Response",
        description: "24/7 emergency response to active roof leaks",
        symptoms: ["Active leaking", "Storm damage", "Interior damage", "Immediate action needed"],
        severity: "emergency",
        estimatedCost: "$300-$1500",
        timeToFix: "1-4 hours"
      }
    ]
  },
  "pest-control": {
    description: "Comprehensive pest control and prevention services for residential and commercial properties",
    issues: [
      {
        title: "Termite Treatment",
        description: "Complete termite elimination and prevention treatment",
        symptoms: ["Wood damage", "Mud tubes", "Swarmers", "Hollow wood sounds"],
        severity: "severe",
        estimatedCost: "$500-$2500",
        timeToFix: "Initial treatment: 1-3 days, monitoring: 3-6 months"
      },
      {
        title: "Rodent Control",
        description: "Comprehensive rodent elimination and prevention program",
        symptoms: ["Droppings", "Scratching noises", "Gnaw marks", "Nesting materials"],
        severity: "severe",
        estimatedCost: "$300-$1000",
        timeToFix: "Initial setup: 1-2 days, monitoring: 2-4 weeks"
      },
      {
        title: "Bed Bug Treatment",
        description: "Multi-phase bed bug elimination treatment",
        symptoms: ["Bite marks", "Blood spots", "Live bugs", "Shell casings"],
        severity: "severe",
        estimatedCost: "$1000-$3000",
        timeToFix: "2-3 treatments over 6-8 weeks"
      },
      {
        title: "Cockroach Elimination",
        description: "Targeted cockroach removal and prevention",
        symptoms: ["Live roaches", "Droppings", "Egg cases", "Musty odor"],
        severity: "severe",
        estimatedCost: "$200-$800",
        timeToFix: "Initial treatment + 2-3 follow-ups over 1 month"
      },
      {
        title: "Ant Control",
        description: "Professional ant colony elimination",
        symptoms: ["Ant trails", "Nests", "Wood damage", "Food contamination"],
        severity: "moderate",
        estimatedCost: "$150-$500",
        timeToFix: "1-2 treatments over 2 weeks"
      },
      {
        title: "Mosquito Treatment",
        description: "Yard and property mosquito control program",
        symptoms: ["Excessive mosquitoes", "Breeding sites", "Outdoor unusable", "Bites"],
        severity: "moderate",
        estimatedCost: "$200-$600",
        timeToFix: "Monthly treatments during season"
      },
      {
        title: "Wasp Nest Removal",
        description: "Safe removal of wasp and hornet nests",
        symptoms: ["Visible nests", "Aggressive insects", "Heavy activity", "Safety concerns"],
        severity: "emergency",
        estimatedCost: "$100-$400",
        timeToFix: "1-2 hours, may need follow-up"
      },
      {
        title: "Wildlife Removal",
        description: "Humane removal of wildlife from properties",
        symptoms: ["Animal sounds", "Property damage", "Entry holes", "Droppings"],
        severity: "severe",
        estimatedCost: "$300-$1200",
        timeToFix: "2-7 days for complete removal"
      },
      {
        title: "Spider Control",
        description: "Spider elimination and web removal service",
        symptoms: ["Visible spiders", "Excessive webs", "Egg sacs", "Bite concerns"],
        severity: "moderate",
        estimatedCost: "$150-$400",
        timeToFix: "1-2 treatments over 2 weeks"
      },
      {
        title: "Flea Treatment",
        description: "Comprehensive flea elimination program",
        symptoms: ["Flea bites", "Pets scratching", "Visible fleas", "Larvae"],
        severity: "moderate",
        estimatedCost: "$200-$600",
        timeToFix: "2-3 treatments over 3-4 weeks"
      },
      {
        title: "Commercial Pest Management",
        description: "Ongoing pest control for businesses",
        symptoms: ["Regular maintenance", "Health code compliance", "Prevention", "Documentation"],
        severity: "moderate",
        estimatedCost: "$500-$2000",
        timeToFix: "Monthly or quarterly service"
      },
      {
        title: "Carpenter Ant Treatment",
        description: "Specialized carpenter ant elimination",
        symptoms: ["Wood damage", "Sawdust piles", "Visible ants", "Hollow wood"],
        severity: "severe",
        estimatedCost: "$300-$1000",
        timeToFix: "2-3 treatments over 1 month"
      },
      {
        title: "Moth Control",
        description: "Fabric and pantry moth elimination",
        symptoms: ["Damaged clothes", "Flying moths", "Larvae", "Webbing"],
        severity: "moderate",
        estimatedCost: "$200-$500",
        timeToFix: "2-3 treatments over 2-3 weeks"
      },
      {
        title: "Tick Control",
        description: "Property-wide tick prevention and control",
        symptoms: ["Tick presence", "Pet issues", "Yard infestation", "Health concerns"],
        severity: "severe",
        estimatedCost: "$300-$800",
        timeToFix: "Seasonal treatments (3-6 months)"
      },
      {
        title: "Preventive Pest Control",
        description: "Year-round pest prevention program",
        symptoms: ["Maintenance needed", "Prevention", "Multiple pests", "Seasonal changes"],
        severity: "minor",
        estimatedCost: "$400-$1200",
        timeToFix: "Quarterly treatments"
      },
      {
        title: "Silverfish Treatment",
        description: "Targeted silverfish elimination",
        symptoms: ["Paper damage", "Book damage", "Night activity", "Humidity issues"],
        severity: "moderate",
        estimatedCost: "$150-$400",
        timeToFix: "1-2 treatments over 2 weeks"
      },
      {
        title: "Bird Control",
        description: "Humane bird deterrent installation",
        symptoms: ["Nesting", "Droppings", "Property damage", "Health concerns"],
        severity: "moderate",
        estimatedCost: "$500-$2000",
        timeToFix: "2-5 days for installation"
      },
      {
        title: "Emergency Pest Response",
        description: "24/7 emergency pest situation handling",
        symptoms: ["Immediate threat", "Health hazard", "Safety concern", "Infestation"],
        severity: "emergency",
        estimatedCost: "$200-$800",
        timeToFix: "Same day response"
      },
      {
        title: "Bee Removal",
        description: "Safe and professional bee colony removal",
        symptoms: ["Visible hive", "Bee activity", "Property access", "Safety risks"],
        severity: "emergency",
        estimatedCost: "$200-$1000",
        timeToFix: "4-8 hours"
      },
      {
        title: "Post-Construction Pest Control",
        description: "Comprehensive pest prevention after construction",
        symptoms: ["New construction", "Prevention needs", "Code compliance", "Multiple risks"],
        severity: "moderate",
        estimatedCost: "$500-$2000",
        timeToFix: "1-3 days initial treatment"
      }
    ]
  },
  appliances: {
    description: "Repair and maintenance services for household appliances",
    issues: [
      {
        title: "Refrigerator Not Cooling",
        description: "Refrigerator failing to maintain proper temperature",
        symptoms: ["Warm food", "Running constantly", "Ice buildup", "Noise"],
        severity: "severe",
        estimatedCost: "$200-$700",
        timeToFix: "2-4 hours"
      }
    ]
  },
  carpentry: {
    description: "Professional carpentry and woodworking services",
    issues: [
      {
        title: "Door Repair",
        description: "Door not closing or functioning properly",
        symptoms: ["Sticking", "Not latching", "Squeaking", "Gaps"],
        severity: "minor",
        estimatedCost: "$100-$300",
        timeToFix: "1-3 hours"
      }
    ]
  },
  flooring: {
    description: "Flooring installation, repair, and maintenance services",
    issues: [
      {
        title: "Damaged Hardwood",
        description: "Scratched or damaged hardwood flooring",
        symptoms: ["Scratches", "Dents", "Warping", "Discoloration"],
        severity: "moderate",
        estimatedCost: "$200-$800",
        timeToFix: "4-8 hours"
      }
    ]
  },
  painting: {
    description: "Interior and exterior painting services",
    issues: [
      {
        title: "Interior Paint Job",
        description: "Room or interior space painting",
        symptoms: ["Peeling", "Fading", "Water stains", "Cracks"],
        severity: "minor",
        estimatedCost: "$300-$1000",
        timeToFix: "1-3 days"
      }
    ]
  },
  landscaping: {
    description: "Professional landscaping and outdoor maintenance services for residential and commercial properties",
    issues: [
      {
        title: "Lawn Installation",
        description: "Complete lawn installation including soil preparation and sod/seed application",
        symptoms: ["Bare ground", "New construction", "Dead lawn", "Soil issues"],
        severity: "moderate",
        estimatedCost: "$2000-$8000",
        timeToFix: "3-7 days, plus 2-3 weeks establishment"
      },
      {
        title: "Tree Removal",
        description: "Professional removal of trees including stump grinding",
        symptoms: ["Dead/dying tree", "Safety hazard", "Construction needs", "Disease"],
        severity: "severe",
        estimatedCost: "$500-$2500",
        timeToFix: "1-2 days"
      },
      {
        title: "Irrigation System Installation",
        description: "Complete sprinkler system design and installation",
        symptoms: ["Dry lawn", "Uneven watering", "Water waste", "Manual watering needed"],
        severity: "moderate",
        estimatedCost: "$2500-$6000",
        timeToFix: "2-5 days"
      },
      {
        title: "Hardscape Installation",
        description: "Custom patio, walkway, or retaining wall construction",
        symptoms: ["Erosion issues", "Outdoor living needs", "Property value improvement"],
        severity: "moderate",
        estimatedCost: "$3000-$15000",
        timeToFix: "5-14 days"
      },
      {
        title: "Landscape Design",
        description: "Professional landscape architecture and planning",
        symptoms: ["Property improvement", "Curb appeal", "Functionality needs"],
        severity: "minor",
        estimatedCost: "$1500-$5000",
        timeToFix: "2-4 weeks for design and planning"
      },
      {
        title: "Regular Lawn Maintenance",
        description: "Ongoing lawn care including mowing, edging, and cleanup",
        symptoms: ["Overgrown grass", "Untidy edges", "Regular maintenance needed"],
        severity: "minor",
        estimatedCost: "$100-$200 per visit",
        timeToFix: "Weekly or bi-weekly service"
      },
      {
        title: "Tree Pruning",
        description: "Professional tree trimming and shaping",
        symptoms: ["Overgrown branches", "Dead limbs", "Safety concerns", "Light blockage"],
        severity: "moderate",
        estimatedCost: "$300-$1000",
        timeToFix: "1-2 days"
      },
      {
        title: "Drainage Solution",
        description: "Water management and drainage system installation",
        symptoms: ["Standing water", "Flooding", "Foundation risks", "Lawn damage"],
        severity: "severe",
        estimatedCost: "$2000-$6000",
        timeToFix: "3-7 days"
      },
      {
        title: "Garden Design & Installation",
        description: "Custom garden creation including plants and hardscape",
        symptoms: ["Blank space", "Aesthetic enhancement", "Food production needs"],
        severity: "minor",
        estimatedCost: "$2000-$10000",
        timeToFix: "1-2 weeks"
      },
      {
        title: "Mulch Installation",
        description: "Professional mulch application and bed preparation",
        symptoms: ["Bare soil", "Weed issues", "Moisture control needed", "Aesthetics"],
        severity: "minor",
        estimatedCost: "$500-$1500",
        timeToFix: "1-2 days"
      },
      {
        title: "Fence Installation",
        description: "Custom fence design and installation",
        symptoms: ["Privacy needs", "Security concerns", "Property definition"],
        severity: "moderate",
        estimatedCost: "$2500-$8000",
        timeToFix: "2-5 days"
      },
      {
        title: "Outdoor Lighting",
        description: "Landscape lighting design and installation",
        symptoms: ["Dark areas", "Security needs", "Aesthetic enhancement"],
        severity: "minor",
        estimatedCost: "$1500-$5000",
        timeToFix: "2-4 days"
      },
      {
        title: "Lawn Disease Treatment",
        description: "Diagnosis and treatment of lawn diseases",
        symptoms: ["Brown patches", "Fungal growth", "Thinning grass", "Discoloration"],
        severity: "moderate",
        estimatedCost: "$200-$1000",
        timeToFix: "Initial treatment 1 day, monitoring 2-4 weeks"
      },
      {
        title: "Weed Control",
        description: "Comprehensive weed management program",
        symptoms: ["Weed invasion", "Lawn deterioration", "Garden bed issues"],
        severity: "moderate",
        estimatedCost: "$150-$500",
        timeToFix: "Multiple treatments over 2-3 months"
      },
      {
        title: "Leaf Removal",
        description: "Professional leaf cleanup and disposal",
        symptoms: ["Heavy leaf coverage", "Lawn health concerns", "Aesthetic issues"],
        severity: "minor",
        estimatedCost: "$200-$600",
        timeToFix: "1-2 days, seasonal service"
      },
      {
        title: "Aeration and Overseeding",
        description: "Lawn aeration and grass seed application",
        symptoms: ["Compacted soil", "Thin grass", "Poor growth", "Heavy traffic areas"],
        severity: "moderate",
        estimatedCost: "$300-$800",
        timeToFix: "1 day, plus 2-3 weeks growth"
      },
      {
        title: "Snow Removal",
        description: "Professional snow clearing and ice management",
        symptoms: ["Snow accumulation", "Access issues", "Safety concerns"],
        severity: "emergency",
        estimatedCost: "$100-$500 per visit",
        timeToFix: "Same day service"
      },
      {
        title: "Water Feature Installation",
        description: "Custom fountain, pond, or waterfall creation",
        symptoms: ["Aesthetic enhancement", "Sound masking", "Property value"],
        severity: "minor",
        estimatedCost: "$2000-$10000",
        timeToFix: "3-7 days"
      },
      {
        title: "Soil Testing and Amendment",
        description: "Soil analysis and improvement services",
        symptoms: ["Poor growth", "pH issues", "Nutrient deficiency"],
        severity: "moderate",
        estimatedCost: "$200-$1000",
        timeToFix: "1-2 weeks for testing and treatment"
      },
      {
        title: "Emergency Storm Cleanup",
        description: "Rapid response storm damage cleanup",
        symptoms: ["Fallen trees", "Debris", "Property damage", "Safety hazards"],
        severity: "emergency",
        estimatedCost: "$500-$3000",
        timeToFix: "Same day to 2-3 days"
      }
    ]
  },
  security: {
    description: "Home and business security system services",
    issues: [
      {
        title: "Security System Installation",
        description: "New security system setup",
        symptoms: ["No protection", "Old system", "Vulnerabilities"],
        severity: "moderate",
        estimatedCost: "$500-$2000",
        timeToFix: "4-8 hours"
      }
    ]
  },
  cleaning: {
    description: "Professional cleaning services for residential, commercial, and specialized facilities",
    issues: [
      {
        title: "Deep Commercial Cleaning",
        description: "Comprehensive cleaning of commercial spaces including floors, surfaces, and high areas",
        symptoms: [
          "Regular maintenance needed",
          "Visible dirt/dust",
          "High traffic wear",
          "Professional appearance needed"
        ],
        severity: "moderate",
        estimatedCost: "$300-$1500",
        timeToFix: "4-8 hours, recurring service available"
      },
      {
        title: "Medical Facility Cleaning",
        description: "Specialized cleaning for medical offices and healthcare facilities",
        symptoms: [
          "Healthcare compliance",
          "Infection control",
          "Biohazard handling",
          "Sterile environment needed"
        ],
        severity: "severe",
        estimatedCost: "$500-$2000",
        timeToFix: "4-6 hours, daily/weekly service"
      },
      {
        title: "Post-Construction Cleanup",
        description: "Detailed cleaning after construction or renovation projects",
        symptoms: [
          "Construction debris",
          "Dust coverage",
          "Paint overspray",
          "Material residue"
        ],
        severity: "moderate",
        estimatedCost: "$800-$3000",
        timeToFix: "1-3 days"
      },
      {
        title: "Industrial Floor Cleaning",
        description: "Deep cleaning of industrial and warehouse floors",
        symptoms: [
          "Oil/grease buildup",
          "Heavy soil",
          "Safety concerns",
          "Compliance requirements"
        ],
        severity: "moderate",
        estimatedCost: "$500-$2500",
        timeToFix: "6-12 hours"
      },
      {
        title: "Window Cleaning Service",
        description: "Professional interior/exterior window cleaning",
        symptoms: [
          "Visible streaks",
          "Sun blockage",
          "Professional appearance",
          "Hard-to-reach areas"
        ],
        severity: "minor",
        estimatedCost: "$200-$1000",
        timeToFix: "4-8 hours"
      },
      {
        title: "Carpet Deep Cleaning",
        description: "Professional carpet extraction and deep cleaning",
        symptoms: [
          "Visible stains",
          "Odors",
          "Heavy traffic wear",
          "Allergies/health concerns"
        ],
        severity: "moderate",
        estimatedCost: "$200-$800",
        timeToFix: "4-6 hours, 24-48 hours drying"
      },
      {
        title: "High-Rise Window Cleaning",
        description: "Specialized cleaning for tall buildings and difficult access areas",
        symptoms: [
          "Height access needed",
          "Safety requirements",
          "Professional appearance",
          "Weather damage"
        ],
        severity: "moderate",
        estimatedCost: "$1000-$5000",
        timeToFix: "1-3 days"
      },
      {
        title: "Restaurant Kitchen Cleaning",
        description: "Specialized cleaning for commercial kitchens and food prep areas",
        symptoms: [
          "Health code compliance",
          "Grease buildup",
          "Food safety",
          "Inspection preparation"
        ],
        severity: "severe",
        estimatedCost: "$400-$1200",
        timeToFix: "4-8 hours"
      },
      {
        title: "Office Sanitization Service",
        description: "Detailed cleaning and sanitization of office spaces",
        symptoms: [
          "Health concerns",
          "Regular maintenance",
          "Employee safety",
          "Professional environment"
        ],
        severity: "moderate",
        estimatedCost: "$200-$800",
        timeToFix: "2-4 hours, recurring service"
      },
      {
        title: "Pressure Washing Service",
        description: "High-pressure cleaning of exterior surfaces",
        symptoms: [
          "Dirt buildup",
          "Mold/mildew",
          "Stains",
          "Curb appeal"
        ],
        severity: "moderate",
        estimatedCost: "$300-$1200",
        timeToFix: "4-8 hours"
      },
      {
        title: "Air Duct Cleaning",
        description: "Professional cleaning of HVAC ducts and vents",
        symptoms: [
          "Poor air quality",
          "Dust accumulation",
          "Allergies",
          "Energy efficiency"
        ],
        severity: "moderate",
        estimatedCost: "$400-$1000",
        timeToFix: "4-8 hours"
      },
      {
        title: "Emergency Cleanup Service",
        description: "24/7 response for water damage, accidents, or hazardous situations",
        symptoms: [
          "Water damage",
          "Accidents",
          "Biohazards",
          "Immediate response needed"
        ],
        severity: "emergency",
        estimatedCost: "$500-$3000",
        timeToFix: "Same day emergency service"
      },
      {
        title: "Upholstery Cleaning",
        description: "Professional cleaning of furniture and office seating",
        symptoms: [
          "Visible stains",
          "Odors",
          "Wear and tear",
          "Allergies"
        ],
        severity: "minor",
        estimatedCost: "$200-$600",
        timeToFix: "2-4 hours, 24 hours drying"
      },
      {
        title: "Data Center Cleaning",
        description: "Specialized cleaning for server rooms and data centers",
        symptoms: [
          "Dust accumulation",
          "Static control",
          "Equipment protection",
          "Compliance requirements"
        ],
        severity: "severe",
        estimatedCost: "$800-$2500",
        timeToFix: "4-8 hours"
      },
      {
        title: "School/University Cleaning",
        description: "Comprehensive cleaning for educational facilities",
        symptoms: [
          "Daily maintenance",
          "High traffic areas",
          "Health standards",
          "Multiple facilities"
        ],
        severity: "moderate",
        estimatedCost: "$1000-$5000",
        timeToFix: "8-12 hours, recurring service"
      },
      {
        title: "Warehouse Cleaning",
        description: "Industrial cleaning for warehouse and storage facilities",
        symptoms: [
          "Dust control",
          "Safety compliance",
          "Equipment protection",
          "Regular maintenance"
        ],
        severity: "moderate",
        estimatedCost: "$800-$3000",
        timeToFix: "8-12 hours"
      },
      {
        title: "Clean Room Maintenance",
        description: "Specialized cleaning for controlled environments",
        symptoms: [
          "Contamination control",
          "Particle count",
          "Compliance standards",
          "Sterile environment"
        ],
        severity: "severe",
        estimatedCost: "$1000-$3000",
        timeToFix: "4-6 hours, regular monitoring"
      },
      {
        title: "Stadium/Arena Cleaning",
        description: "Large-scale cleaning for entertainment venues",
        symptoms: [
          "Event cleanup",
          "High volume traffic",
          "Public health",
          "Quick turnaround"
        ],
        severity: "moderate",
        estimatedCost: "$2000-$10000",
        timeToFix: "8-24 hours"
      },
      {
        title: "Retail Store Cleaning",
        description: "Professional cleaning for retail environments",
        symptoms: [
          "Customer appearance",
          "Daily maintenance",
          "Display cleaning",
          "Floor care"
        ],
        severity: "moderate",
        estimatedCost: "$200-$800",
        timeToFix: "2-4 hours, recurring service"
      },
      {
        title: "Hotel Room Turnover",
        description: "Rapid cleaning and preparation of hotel rooms",
        symptoms: [
          "Guest turnover",
          "High standards",
          "Quick response",
          "Multiple rooms"
        ],
        severity: "moderate",
        estimatedCost: "$30-$100 per room",
        timeToFix: "30-60 minutes per room"
      }
    ]
  },
  "restaurant-maintenance": {
    description: "Specialized maintenance services for restaurants, commercial kitchens, and food service facilities",
    issues: [
      {
        title: "Grease Trap Cleaning",
        description: "Professional cleaning and maintenance of grease interceptors and traps",
        symptoms: [
          "Slow drainage",
          "Foul odors",
          "Backup issues",
          "Health code compliance"
        ],
        severity: "severe",
        estimatedCost: "$300-$1000",
        timeToFix: "2-4 hours, monthly service recommended"
      },
      {
        title: "Commercial Drain Cleaning",
        description: "High-pressure cleaning of kitchen and facility drains",
        symptoms: [
          "Slow draining",
          "Blockages",
          "Bad odors",
          "Flooding risks"
        ],
        severity: "severe",
        estimatedCost: "$200-$800",
        timeToFix: "2-6 hours"
      },
      {
        title: "Hood System Cleaning",
        description: "Complete cleaning of exhaust hoods, ducts, and fans",
        symptoms: [
          "Grease buildup",
          "Fire hazard",
          "Code violations",
          "Reduced efficiency"
        ],
        severity: "severe",
        estimatedCost: "$400-$1200",
        timeToFix: "4-8 hours, quarterly service required"
      },
      {
        title: "Commercial Refrigeration Repair",
        description: "Repair and maintenance of walk-in coolers and freezers",
        symptoms: [
          "Temperature fluctuations",
          "Strange noises",
          "Ice buildup",
          "Door seal issues"
        ],
        severity: "emergency",
        estimatedCost: "$500-$3000",
        timeToFix: "Same day emergency service"
      },
      {
        title: "Kitchen Equipment Repair",
        description: "Repair of commercial ovens, ranges, and cooking equipment",
        symptoms: [
          "Not heating properly",
          "Gas smell",
          "Ignition issues",
          "Temperature control problems"
        ],
        severity: "severe",
        estimatedCost: "$300-$2000",
        timeToFix: "2-8 hours"
      },
      {
        title: "Fire Suppression Inspection",
        description: "Mandatory inspection and certification of fire suppression systems",
        symptoms: [
          "Annual requirement",
          "Post-discharge inspection",
          "Code compliance",
          "System modifications"
        ],
        severity: "severe",
        estimatedCost: "$300-$800",
        timeToFix: "2-4 hours, semi-annual requirement"
      },
      {
        title: "Dishwasher System Maintenance",
        description: "Commercial dishwasher repair and maintenance",
        symptoms: [
          "Poor cleaning results",
          "Water temperature issues",
          "Leaks",
          "Chemical dispensing problems"
        ],
        severity: "severe",
        estimatedCost: "$200-$1000",
        timeToFix: "2-6 hours"
      },
      {
        title: "Floor Drain Maintenance",
        description: "Deep cleaning and maintenance of floor drains and grates",
        symptoms: [
          "Standing water",
          "Odors",
          "Slow drainage",
          "Pest issues"
        ],
        severity: "moderate",
        estimatedCost: "$150-$500",
        timeToFix: "2-4 hours"
      },
      {
        title: "Plumbing System Inspection",
        description: "Comprehensive inspection of restaurant plumbing systems",
        symptoms: [
          "Preventive maintenance",
          "Code compliance",
          "Leak detection",
          "Pressure issues"
        ],
        severity: "moderate",
        estimatedCost: "$200-$800",
        timeToFix: "3-6 hours"
      },
      {
        title: "Ventilation System Service",
        description: "HVAC and kitchen ventilation system maintenance",
        symptoms: [
          "Poor air flow",
          "Temperature issues",
          "Excessive smoke",
          "High utility costs"
        ],
        severity: "severe",
        estimatedCost: "$400-$1500",
        timeToFix: "4-8 hours"
      },
      {
        title: "Ice Machine Maintenance",
        description: "Cleaning and maintenance of commercial ice machines",
        symptoms: [
          "Low ice production",
          "Dirty ice",
          "Strange tastes",
          "Scale buildup"
        ],
        severity: "moderate",
        estimatedCost: "$200-$800",
        timeToFix: "2-4 hours, quarterly service recommended"
      },
      {
        title: "Grease Line Jetting",
        description: "High-pressure cleaning of grease waste lines",
        symptoms: [
          "Slow drainage",
          "Backups",
          "Compliance issues",
          "Odors"
        ],
        severity: "severe",
        estimatedCost: "$400-$1200",
        timeToFix: "4-6 hours"
      },
      {
        title: "Kitchen Floor Repair",
        description: "Repair and maintenance of commercial kitchen flooring",
        symptoms: [
          "Cracks",
          "Water pooling",
          "Non-slip issues",
          "Grout deterioration"
        ],
        severity: "moderate",
        estimatedCost: "$500-$3000",
        timeToFix: "1-3 days"
      },
      {
        title: "Pest Control Service",
        description: "Specialized restaurant pest control and prevention",
        symptoms: [
          "Pest sightings",
          "Droppings",
          "Health code risks",
          "Customer complaints"
        ],
        severity: "severe",
        estimatedCost: "$200-$600",
        timeToFix: "2-4 hours, monthly service recommended"
      },
      {
        title: "Emergency Plumbing Service",
        description: "24/7 emergency plumbing response for restaurants",
        symptoms: [
          "Water leaks",
          "Sewage backup",
          "No hot water",
          "Burst pipes"
        ],
        severity: "emergency",
        estimatedCost: "$300-$2000",
        timeToFix: "Same day emergency service"
      },
      {
        title: "Backflow Prevention Testing",
        description: "Mandatory testing and certification of backflow preventers",
        symptoms: [
          "Annual requirement",
          "Code compliance",
          "Water safety",
          "System modifications"
        ],
        severity: "severe",
        estimatedCost: "$150-$500",
        timeToFix: "2-3 hours, annual requirement"
      },
      {
        title: "Kitchen Equipment Calibration",
        description: "Calibration of cooking and refrigeration equipment",
        symptoms: [
          "Temperature inconsistencies",
          "Quality control issues",
          "Energy efficiency",
          "Performance problems"
        ],
        severity: "moderate",
        estimatedCost: "$200-$600",
        timeToFix: "2-4 hours"
      },
      {
        title: "Waste Oil System Maintenance",
        description: "Maintenance of waste oil collection and storage systems",
        symptoms: [
          "Collection issues",
          "Storage problems",
          "Disposal concerns",
          "Safety compliance"
        ],
        severity: "moderate",
        estimatedCost: "$200-$800",
        timeToFix: "2-4 hours"
      },
      {
        title: "Kitchen Safety Inspection",
        description: "Comprehensive safety and compliance inspection",
        symptoms: [
          "Regular requirement",
          "Code compliance",
          "Insurance requirement",
          "Risk assessment"
        ],
        severity: "severe",
        estimatedCost: "$300-$1000",
        timeToFix: "4-6 hours"
      },
      {
        title: "Emergency Equipment Repair",
        description: "24/7 emergency repair for critical kitchen equipment",
        symptoms: [
          "Equipment failure",
          "Safety hazards",
          "Production stoppage",
          "Revenue loss risk"
        ],
        severity: "emergency",
        estimatedCost: "$500-$3000",
        timeToFix: "Same day emergency service"
      }
    ]
  }
};
