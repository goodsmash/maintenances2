import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CategorySelectorProps {
  onCategoryChange: (value: string) => void;
  selectedCategory: string;
}

export const CategorySelector = ({ onCategoryChange, selectedCategory }: CategorySelectorProps) => {
  const mainCategories = {
    "Residential Plumbing": [
      "Leak Repairs", "Drain Cleaning", "Pipe Installation", "Water Heater Services",
      "Sump Pump Maintenance", "Bathroom Fixtures", "Kitchen Plumbing", "Sewer Line Services",
      "Water Line Services", "Gas Line Services", "Backflow Prevention", "Water Filtration Systems",
      "Emergency Plumbing", "Plumbing Inspections", "Water Pressure Issues", "Toilet Repairs",
      "Faucet Installation", "Garbage Disposal", "Water Softener Service", "Pipe Insulation"
    ],
    "Commercial Plumbing": [
      "Industrial Pipe Systems", "Grease Trap Services", "Commercial Drain Cleaning",
      "Backflow Testing", "Water Main Services", "Commercial Water Heaters", "Emergency Services",
      "Code Compliance", "Restaurant Plumbing", "Industrial Waste Systems", "High-Rise Plumbing",
      "Commercial Bathroom", "Kitchen Equipment", "Boiler Systems", "Water Treatment"
    ],
    "HVAC Systems": [
      "AC Repair & Maintenance", "Heating System Services", "Ventilation Systems",
      "Ductwork Services", "Commercial HVAC", "Industrial Cooling", "Heat Pump Services",
      "Thermostat Installation", "Energy Efficiency", "Air Quality Solutions",
      "Emergency HVAC Services", "Refrigeration", "Zoning Systems", "UV Air Treatment",
      "Smart HVAC Controls", "Annual Maintenance"
    ],
    "Electrical Services": [
      "Wiring Installation", "Circuit Repairs", "Panel Upgrades", "Lighting Installation",
      "Generator Services", "Surge Protection", "Emergency Electrical", "Code Compliance",
      "Safety Inspections", "Commercial Electric", "Industrial Electric", "Data Wiring",
      "EV Charging Stations", "Solar Panel Systems", "Backup Power Systems"
    ],
    "Restaurant Equipment": [
      "Commercial Kitchen Repair", "Refrigeration Systems", "Cooking Equipment",
      "Dishwashing Systems", "Food Prep Equipment", "Ventilation Hood Service",
      "Walk-in Coolers", "Ice Machines", "Beverage Systems", "Food Warmers",
      "Steam Tables", "Fryers & Grills", "Ovens & Ranges", "Safety Equipment"
    ],
    "Building Systems": [
      "Elevator Maintenance", "Fire Protection", "Security Systems", "Access Control",
      "Building Automation", "Emergency Systems", "Intercom Systems", "Parking Systems",
      "Loading Dock Equipment", "Waste Management", "Building Controls", "Safety Equipment"
    ],
    "Property Maintenance": [
      "General Repairs", "Preventive Maintenance", "Property Inspections",
      "Emergency Services", "Seasonal Maintenance", "Building Exterior",
      "Common Areas", "Safety Systems", "Grounds Maintenance", "Pest Control"
    ],
    "Structural & Construction": [
      "Foundation Repairs", "Wall Repairs", "Ceiling Work", "Concrete Services",
      "Steel Structure", "Masonry Work", "Carpentry", "Waterproofing",
      "Seismic Retrofitting", "Building Expansion", "Structural Assessment"
    ],
    "Roofing & Building Envelope": [
      "Roof Repairs", "Leak Detection", "Preventive Maintenance", "Emergency Services",
      "Commercial Roofing", "Industrial Roofing", "Roof Inspection", "Gutter Systems",
      "Facade Maintenance", "Window Systems", "Door Systems", "Weather Sealing"
    ],
    "Environmental Services": [
      "Air Quality Testing", "Water Quality", "Asbestos Management", "Lead Testing",
      "Mold Remediation", "Indoor Air Quality", "Environmental Compliance",
      "Waste Management", "Recycling Programs", "Green Building Services"
    ],
    "Safety & Compliance": [
      "Fire Safety Systems", "Emergency Lighting", "Security Systems", "Access Control",
      "Code Compliance", "Safety Inspections", "Health Regulations", "Environmental Services",
      "OSHA Compliance", "ADA Compliance", "Building Codes", "Safety Training"
    ],
    "Specialized Equipment": [
      "Medical Equipment", "Laboratory Systems", "Industrial Machinery",
      "Manufacturing Equipment", "Warehouse Systems", "Clean Room Equipment",
      "Data Center Infrastructure", "Specialized HVAC", "Process Equipment"
    ]
  };

  return (
    <div className="w-full max-w-md">
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select a maintenance category" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {Object.entries(mainCategories).map(([mainCategory, subCategories]) => (
            <div key={mainCategory}>
              <h3 className="px-2 py-1.5 text-sm font-semibold bg-secondary">{mainCategory}</h3>
              {subCategories.map((subCategory) => (
                <SelectItem key={subCategory} value={subCategory}>
                  {subCategory}
                </SelectItem>
              ))}
            </div>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};