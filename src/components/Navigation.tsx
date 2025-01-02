import { Button } from "@/components/ui/button";
import { Building2, Menu, User, Settings, CreditCard } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { serviceCategories } from "@/data/serviceCategories";
import { maintenanceCategories } from "@/data/maintenanceCategories";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0();

  const handleLogout = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-accent">MaintenancePro</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-4">
            {/* Services Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">Services</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {serviceCategories.map((category) => (
                  <DropdownMenuItem key={category.id}>
                    <Link 
                      to={`/service/${category.id}`}
                      className="w-full"
                    >
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/service/commercial" className="w-full">
                    Commercial Services
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/subscription" className="w-full">
                    Maintenance Plans
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Maintenance Categories Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">Maintenance</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                {maintenanceCategories.map((category) => (
                  <DropdownMenuItem key={category.id}>
                    <Link 
                      to={`/service/page/${category.id}`}
                      className="w-full"
                    >
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Link to="/request-service">
              <Button variant="default">Request Service</Button>
            </Link>

            {isAuthenticated ? (
              <>
                <Link to="/dashboard">
                  <Button variant="ghost">Dashboard</Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link to="/profile" className="w-full flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/subscription" className="w-full flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" />
                        Subscription
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Link to="/settings" className="w-full flex items-center">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Button variant="default" onClick={() => loginWithRedirect()}>
                Sign In
              </Button>
            )}
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
              {serviceCategories.map((category) => (
                <Link 
                  key={category.id}
                  to={`/service/${category.id}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Button variant="ghost" className="w-full text-left">
                    {category.name}
                  </Button>
                </Link>
              ))}
              <Link to="/service/commercial" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full text-left">
                  Commercial Services
                </Button>
              </Link>
              <Link to="/subscription" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full text-left">
                  Maintenance Plans
                </Button>
              </Link>
              <Link to="/request-service" onClick={() => setIsMenuOpen(false)}>
                <Button variant="ghost" className="w-full text-left">
                  Request Service
                </Button>
              </Link>
              {isAuthenticated ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full text-left">
                      Dashboard
                    </Button>
                  </Link>
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full text-left">
                      Profile
                    </Button>
                  </Link>
                  <Link to="/subscription" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full text-left">
                      Subscription
                    </Button>
                  </Link>
                  <Link to="/settings" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full text-left">
                      Settings
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleLogout}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => loginWithRedirect()}
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;