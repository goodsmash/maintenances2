import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import ErrorBoundary from "./components/ErrorBoundary"
import { MainNav } from "./components/MainNav"
import Index from "./pages/Index"
import SubscriptionPage from './pages/Subscription'
import ServicePage from './pages/ServicePage'
import CommercialServicePage from './pages/CommercialServicePage'
import ApplianceServices from "./pages/ApplianceServices"
import CommercialServices from "./pages/CommercialServices"
import CommercialServiceCategory from './pages/CommercialServiceCategory';
import PaintingServices from "./pages/PaintingServices";
import PaintingServiceCategory from "./pages/PaintingServiceCategory";
import ContractorServices from "./pages/ContractorServices";
import ContractorServiceCategory from "./pages/ContractorServiceCategory";
import { LanguageProvider } from "./context/LanguageContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LanguageProvider>
          <TooltipProvider>
            <Router>
              <div className="relative min-h-screen">
                <MainNav />
                <div className="pt-16">
                  <Routes>
                    <Route path="/" element={<Index />} />
                    <Route path="/subscription" element={<SubscriptionPage />} />
                    <Route path="/service/:category" element={<ServicePage />} />
                    <Route path="/service/commercial/:category" element={<CommercialServiceCategory />} />
                    <Route path="/service/commercial" element={<CommercialServices />} />
                    <Route path="/service/appliances" element={<ApplianceServices />} />
                    <Route path="/service/painting" element={<PaintingServices />} />
                    <Route path="/service/painting/:category" element={<PaintingServiceCategory />} />
                    <Route path="/service/contractor" element={<ContractorServices />} />
                    <Route path="/service/contractor/:category" element={<ContractorServiceCategory />} />
                  </Routes>
                </div>
              </div>
              <Toaster />
              <Sonner />
            </Router>
          </TooltipProvider>
        </LanguageProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
