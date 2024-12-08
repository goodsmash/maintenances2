import { Button } from "@/components/ui/button";
import { Building2, Home, Menu } from "lucide-react";
import { useState } from "react";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-accent">Maintenances.org</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost">Find Contractors</Button>
            <Button variant="ghost">Maintenance Requests</Button>
            <Button variant="ghost">Permit Services</Button>
            <Button variant="default">Post a Job</Button>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-2">
              <Button variant="ghost" className="w-full text-left">Find Contractors</Button>
              <Button variant="ghost" className="w-full text-left">Maintenance Requests</Button>
              <Button variant="ghost" className="w-full text-left">Permit Services</Button>
              <Button variant="default" className="w-full">Post a Job</Button>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};