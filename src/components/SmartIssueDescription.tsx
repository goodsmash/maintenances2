import React, { useState, useEffect } from 'react';
import { Command } from "cmdk";
import {
  Command as CommandPrimitive,
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
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { ClipboardList, Plus } from "lucide-react";

interface Suggestion {
  text: string;
  category: string;
}

interface SmartIssueDescriptionProps {
  value: string;
  onChange: (value: string) => void;
  category: string;
  subcategory: string;
  className?: string;
}

export function SmartIssueDescription({
  value,
  onChange,
  category,
  subcategory,
  className
}: SmartIssueDescriptionProps) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);

  // Mock function to get issue suggestions based on category and subcategory
  const getSuggestions = (category: string, subcategory: string): Suggestion[] => {
    const suggestions: Record<string, Suggestion[]> = {
      plumbing: [
        { text: "Water is not draining from sink", category: "Drainage" },
        { text: "Low water pressure in all faucets", category: "Water Pressure" },
        { text: "Hot water not working", category: "Water Heater" },
        { text: "Leaking pipe under sink", category: "Leaks" }
      ],
      hvac: [
        { text: "AC not cooling properly", category: "Cooling" },
        { text: "Strange noise from heating unit", category: "Heating" },
        { text: "Thermostat not responding", category: "Controls" },
        { text: "Poor airflow from vents", category: "Ventilation" }
      ],
      electrical: [
        { text: "Circuit breaker keeps tripping", category: "Electrical Panel" },
        { text: "Lights flickering", category: "Lighting" },
        { text: "Outlet not working", category: "Outlets" },
        { text: "Burning smell from electrical panel", category: "Emergency" }
      ]
    };

    return suggestions[subcategory.toLowerCase()] || [];
  };

  useEffect(() => {
    setSuggestions(getSuggestions(category, subcategory));
  }, [category, subcategory]);

  const handleSuggestionSelect = (suggestion: Suggestion) => {
    onChange(suggestion.text);
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe your issue..."
        className={className}
        rows={4}
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="w-full mt-2"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add from common issues
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <CommandPrimitive>
            <CommandInput placeholder="Search common issues..." />
            <CommandEmpty>No suggestions found.</CommandEmpty>
            {suggestions.length > 0 && (
              <CommandGroup>
                {suggestions.map((suggestion, index) => (
                  <CommandItem
                    key={index}
                    onSelect={() => handleSuggestionSelect(suggestion)}
                  >
                    <ClipboardList className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      <span>{suggestion.text}</span>
                      <span className="text-sm text-gray-500">
                        {suggestion.category}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandPrimitive>
        </PopoverContent>
      </Popover>
    </div>
  );
}
