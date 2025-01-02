import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  value, 
  onChange, 
  className = '', 
  placeholder = 'Search...', 
  ...props 
}) => {
  return (
    <div className={`flex gap-2 ${className}`}>
      <div className="relative flex-1">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-10 py-6 text-lg"
          {...props}
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      </div>
      <Button size="lg" className="px-8">
        Search
      </Button>
    </div>
  );
};
