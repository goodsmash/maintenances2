import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Auth0Provider } from '@auth0/auth0-react';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { LanguageProvider } from './context/LanguageContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';
import AppRoutes from './routes'; // Using the main routes file

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Auth0Provider
          domain={import.meta.env.VITE_AUTH0_DOMAIN}
          clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
          authorizationParams={{
            redirect_uri: window.location.origin,
            audience: import.meta.env.VITE_AUTH0_AUDIENCE,
            scope: import.meta.env.VITE_AUTH0_SCOPE
          }}
        >
          <LanguageProvider>
            <TooltipProvider>
              <Router>
                <div className="min-h-screen flex flex-col">
                  <Navigation />
                  <main className="flex-grow">
                    <AppRoutes />
                  </main>
                  <Footer />
                </div>
              </Router>
            </TooltipProvider>
          </LanguageProvider>
        </Auth0Provider>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}

export default App;
