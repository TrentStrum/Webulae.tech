export type NavigationGuard = (user: AuthUser | null) => boolean;

export interface NavigationOptions {
  navigationItems: ReadonlyArray<{ readonly name: string; readonly href: string }>;
  isActive: (href: string) => boolean;
} 