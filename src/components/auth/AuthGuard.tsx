'use client';

import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { LoadingSpinner } from "../ui/loading-spinner";

interface AuthGuardProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

export function AuthGuard({ children, allowedRoles }: AuthGuardProps) {
  const { isLoaded, userId, sessionId } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    if (!userId || !sessionId) {
      router.push('/auth/login');
      return;
    }

    // Role-based access check
    if (allowedRoles) {
      // Implement role check here using getUserRole()
      // Redirect if user doesn't have required role
    }
  }, [isLoaded, userId, sessionId, router, allowedRoles]);

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!userId || !sessionId) {
    return null;
  }

  return <>{children}</>;
}