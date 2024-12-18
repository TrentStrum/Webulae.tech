'use client';

import { useUser, useAuth as useClerkAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

import type { AuthUser } from "@/src/types/authUser.types";

export function useAuth() {
  const { isLoaded, user } = useUser();
  const { isSignedIn } = useClerkAuth();
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (!isLoaded || !user) {
      setAuthUser(null);
      return;
    }

    setAuthUser({
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || '',
      role: (user.publicMetadata.role as AuthUser['role']) || 'client',
      avatar_url: user.imageUrl,
    });
  }, [isLoaded, user]);

  return {
    user: authUser,
    isAuthenticated: isSignedIn,
    isPending: !isLoaded,
  };
}