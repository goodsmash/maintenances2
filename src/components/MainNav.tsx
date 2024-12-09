import { Link } from "react-router-dom"
import { Home, Wrench, ClipboardList, Settings, User, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

const menuItems = [
  { title: "Dashboard", icon: Home, url: "/" },
  { title: "Services", icon: Wrench, url: "/services" },
  { title: "Requests", icon: ClipboardList, url: "/requests" },
  { title: "Subscription", icon: CreditCard, url: "/subscription" },
  { title: "Settings", icon: Settings, url: "/settings" },
  { title: "Profile", icon: User, url: "/profile" },
  { title: "Appliance Services", icon: Wrench, url: "/service/appliances" },
  { title: "Commercial Services", icon: Wrench, url: "/service/commercial" },
]

export function MainNav() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="mr-6 flex items-center space-x-2">
          <span className="hidden font-bold sm:inline-block">MaintenanceHub</span>
        </Link>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <div className="hidden md:flex">
              {menuItems.map((item) => (
                <Button
                  key={item.title}
                  variant="ghost"
                  className={cn(
                    "h-8 w-full justify-start md:w-auto md:justify-center",
                    "px-3"
                  )}
                  asChild
                >
                  <Link to={item.url} className="flex items-center gap-2">
                    <item.icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
