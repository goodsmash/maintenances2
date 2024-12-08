import React, { useState, useEffect } from 'react';
import { Command } from "cmdk";
import { Check, MapPin } from "lucide-react";
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
import { Button } from "./ui/button";

interface Address {
  address: string;
  city: string;
  state: string;
  zipCode: string;
}

interface SmartAddressInputProps {
  value: string;
  onChange: (value: Address) => void;
  className?: string;
}

export function SmartAddressInput({ value, onChange, className }: SmartAddressInputProps) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [suggestions, setSuggestions] = useState<Address[]>([]);

  // Mock function to simulate address suggestions
  const getSuggestions = async (input: string): Promise<Address[]> => {
    // In a real implementation, this would call a geocoding API
    // For now, returning mock data
    if (!input) return [];
    
    return [
      {
        address: input + " Main St",
        city: "New York",
        state: "NY",
        zipCode: "10001"
      },
      {
        address: input + " Broadway",
        city: "New York",
        state: "NY",
        zipCode: "10002"
      },
      {
        address: input + " 5th Avenue",
        city: "New York",
        state: "NY",
        zipCode: "10003"
      }
    ];
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (inputValue.length > 2) {
        const results = await getSuggestions(inputValue);
        setSuggestions(results);
      } else {
        setSuggestions([]);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [inputValue]);

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
            <MapPin className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            {value || "Enter address..."}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <CommandPrimitive>
          <CommandInput
            placeholder="Start typing your address..."
            value={inputValue}
            onValueChange={setInputValue}
          />
          <CommandEmpty>No address found.</CommandEmpty>
          <CommandGroup>
            {suggestions.map((suggestion, index) => (
              <CommandItem
                key={index}
                onSelect={() => {
                  onChange(suggestion);
                  setOpen(false);
                }}
              >
                <Check
                  className={`mr-2 h-4 w-4 ${
                    value === suggestion.address ? "opacity-100" : "opacity-0"
                  }`}
                />
                <div className="flex flex-col">
                  <span>{suggestion.address}</span>
                  <span className="text-sm text-gray-500">
                    {suggestion.city}, {suggestion.state} {suggestion.zipCode}
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandPrimitive>
      </PopoverContent>
    </Popover>
  );
}
