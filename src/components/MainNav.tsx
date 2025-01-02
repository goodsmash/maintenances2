import { Link } from "react-router-dom"
import { Home, Wrench, ClipboardList, Settings, User, CreditCard, LogIn } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useAuth0 } from "@auth0/auth0-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { trackEvent } from "@/lib/services/analytics"

const menuItems = [
  { title: "Home", icon: Home, url: "/" },
  { title: "Services", icon: Wrench, url: "/services" },
  { title: "Requests", icon: ClipboardList, url: "/requests" },
  { title: "Subscription", icon: CreditCard, url: "/subscription" },
  { title: "Settings", icon: Settings, url: "/settings" },
  { title: "Appliance Services", icon: Wrench, url: "/service/appliances" },
  { title: "Commercial Services", icon: Wrench, url: "/service/commercial" },
  { title: "Painting Services", icon: Wrench, url: "/service/painting" },
  { title: "Contractor Services", icon: Wrench, url: "/service/contractor" },
]

export function MainNav() {
  const { isAuthenticated, loginWithRedirect, logout, user } = useAuth0()

  const handleLogin = () => {
    trackEvent('login_initiated')
    loginWithRedirect()
  }

  const handleLogout = () => {
    trackEvent('logout_initiated')
    logout({ logoutParams: { returnTo: window.location.origin } })
  }

  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="hidden font-bold sm:inline-block">
            Maintenance Services
          </span>
        </Link>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {menuItems.map((item) => (
              <Link
                key={item.url}
                to={item.url}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Link>
            ))}
          </div>
          <div className="flex items-center">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.picture} alt={user?.name} />
                      <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="flex items-center">
                      <Home className="mr-2 h-4 w-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogIn className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleLogin}>
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
