import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, UserProfile } from '@/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserProfile['role'][];
  requireSubscription?: boolean;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  requireSubscription = false,
}: ProtectedRouteProps) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await getCurrentUser();
        
        if (!currentUser) {
          navigate('/auth?redirect=' + encodeURIComponent(navigate.location.pathname));
          return;
        }

        if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
          navigate('/unauthorized');
          return;
        }

        if (requireSubscription && 
            (!currentUser.subscription_status || 
             currentUser.subscription_status !== 'active')) {
          navigate('/subscription');
          return;
        }

        setUser(currentUser);
      } catch (error) {
        console.error('Auth check failed:', error);
        navigate('/auth');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [allowedRoles, requireSubscription, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
