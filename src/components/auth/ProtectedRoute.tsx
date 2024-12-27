import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
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
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await getCurrentUser();
        
        if (!currentUser) {
          router.push('/auth?redirect=' + encodeURIComponent(router.asPath));
          return;
        }

        if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
          router.push('/unauthorized');
          return;
        }

        if (requireSubscription && 
            (!currentUser.subscription_status || 
             currentUser.subscription_status !== 'active')) {
          router.push('/subscription');
          return;
        }

        setUser(currentUser);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/auth');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router, allowedRoles, requireSubscription]);

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
