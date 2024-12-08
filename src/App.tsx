import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import ErrorBoundary from "./components/ErrorBoundary"
import Index from "./pages/Index"
import SubscriptionPage from './pages/Subscription'
import ServicePage from './pages/ServicePage'
import CommercialServicePage from './pages/CommercialServicePage'

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
        <TooltipProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
              <Route path="/service/:category" element={<ServicePage />} />
              <Route path="/commercial/:category" element={<CommercialServicePage />} />
            </Routes>
          </Router>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App
