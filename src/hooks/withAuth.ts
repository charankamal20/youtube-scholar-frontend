"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface AuthState {
  isLoading: boolean;
  isAuthenticated: boolean;
  user: any;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: true,
    isAuthenticated: false,
    user: null,
    error: null,
  });
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          credentials: "include",
        });

        if (response.ok) {
          const user = await response.json();
          setAuthState({
            isLoading: false,
            isAuthenticated: true,
            user,
            error: null,
          });
        } else {
          setAuthState({
            isLoading: false,
            isAuthenticated: false,
            user: null,
            error: "Authentication failed",
          });
          router.push("/login");
        }
      } catch (error) {
        setAuthState({
          isLoading: false,
          isAuthenticated: false,
          user: null,
          error: "Network error",
        });
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  return authState;
}
