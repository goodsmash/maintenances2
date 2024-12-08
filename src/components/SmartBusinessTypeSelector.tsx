import React from 'react';
import { Check, Building2 } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Button } from "./ui/button";

interface BusinessType {
  id: string;
  name: string;
  category: string;
  commonIssues: string[];
}

const businessTypes: BusinessType[] = [
  {
    id: "restaurant",
    name: "Restaurant",
    category: "Food Service",
    commonIssues: ["Kitchen Equipment", "Refrigeration", "Ventilation"]
  },
  {
    id: "retail",
    name: "Retail Store",
    category: "Retail",
    commonIssues: ["HVAC", "Lighting", "Security Systems"]
  },
  {
    id: "office",
    name: "Office Space",
    category: "Commercial",
    commonIssues: ["Climate Control", "Electrical", "Plumbing"]
  },
  {
    id: "medical",
    name: "Medical Facility",
    category: "Healthcare",
    commonIssues: ["Specialized Equipment", "Climate Control", "Emergency Systems"]
  },
  {
    id: "warehouse",
    name: "Warehouse",
    category: "Industrial",
    commonIssues: ["Loading Equipment", "Security", "Climate Control"]
  },
  {
    id: "hotel",
    name: "Hotel",
    category: "Hospitality",
    commonIssues: ["Room Systems", "Common Areas", "Pool Maintenance"]
  },
  {
    id: "gym",
    name: "Fitness Center",
    category: "Recreation",
    commonIssues: ["Equipment Maintenance", "HVAC", "Plumbing"]
  },
  {
    id: "salon",
    name: "Salon/Spa",
    category: "Personal Services",
    commonIssues: ["Water Systems", "Climate Control", "Equipment"]
  }
];

interface SmartBusinessTypeSelectorProps {
  value: string;
  onChange: (value: BusinessType) => void;
  className?: string;
}

export function SmartBusinessTypeSelector({
  value,
  onChange,
  className
}: SmartBusinessTypeSelectorProps) {
  const [open, setOpen] = React.useState(false);
  const selectedType = businessTypes.find(type => type.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={`w-full justify-between ${className}`}
        >
          <div className="flex items-center">
            <Building2 className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            {selectedType?.name || "Select business type..."}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search business types..." />
          <CommandEmpty>No business type found.</CommandEmpty>
          <CommandGroup>
            {businessTypes.map((type) => (
              <CommandItem
                key={type.id}
                onSelect={() => {
                  onChange(type);
                  setOpen(false);
                }}
              >
                <Check
                  className={`mr-2 h-4 w-4 ${
                    value === type.id ? "opacity-100" : "opacity-0"
                  }`}
                />
                <div className="flex flex-col">
                  <span>{type.name}</span>
                  <span className="text-sm text-gray-500">
                    {type.category} - Common issues: {type.commonIssues.join(", ")}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
