'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import { useAuthStore } from '@/lib/store/authStore';
import { checkSession, getMe, logout } from '@/lib/api/clientApi';

const PRIVATE_ROUTES = ['/notes', '/profile'];

interface AuthProviderProps {
  children: ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const [isLoading, setIsLoading] = useState(true);
  const { setUser, clearIsAuthenticated, isAuthenticated } = useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isPrivate = PRIVATE_ROUTES.some((route) => pathname.startsWith(route));

    if (!isPrivate) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    const verify = async () => {
      try {
        const session = await checkSession();
        if (session.success) {
          if (!isAuthenticated) {
            const user = await getMe();
            setUser(user);
          }
        } else {
          clearIsAuthenticated();
          await logout();
          router.push('/sign-in');
          return;
        }
      } catch {
        clearIsAuthenticated();
        router.push('/sign-in');
        return;
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, [pathname]);

  if (isLoading && PRIVATE_ROUTES.some((route) => pathname.startsWith(route))) {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
}
