"use client";

import { useAuth } from "@/hooks/withAuth";

export function withAuth<T extends object>(
  WrappedComponent: React.ComponentType<T>
) {
  return function AuthenticatedComponent(props: T) {
    const { isLoading, isAuthenticated, user } = useAuth();

    if (isLoading) {
      return "Loading";
    }

    if (!isAuthenticated) {
      return <div>Redirecting to login...</div>;
    }

    return <WrappedComponent {...props} user={user} />;
  };
}
