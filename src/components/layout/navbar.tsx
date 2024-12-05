'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Code2, Menu, Moon, Sun, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/src/utils/utils';
import { Button } from '@/src/components/ui/button';
import { useAuth } from '@/src/contexts/AuthContext';
import { useMobileMenu } from '@/src/hooks/helpers/use-mobile-menu';
import { useNavigation } from '@/src/hooks/helpers/use-navigation';
import UserMenu from '@/src/components/menu/UserMenu';
import AuthButtons from '@/src/components/buttons/AuthButton';
import { LoadingSpinner } from '@/src/components/ui/loading-spinner';

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const { data: user, isLoading } = useAuth();
  const { isOpen, setIsOpen } = useMobileMenu();
  const { navigationItems, isActive } = useNavigation();
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  return (
    <nav className="bg-background/80 backdrop-blur-sm border-b border-border/40 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex-shrink-0 flex items-center group" aria-label="Home">
              <div className="relative w-8 h-8">
                <div className="absolute inset-0 bg-primary/20 rounded-full group-hover:bg-primary/30 transition-colors" />
                <Code2 className="h-8 w-8 text-primary relative z-10" />
              </div>
              <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary via-secondary to-accent">
                Webulae
              </span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'text-primary border-b-2 border-primary'
                      : 'hover:text-primary',
                  )}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={
                isMounted
                  ? `Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`
                  : 'Toggle theme'
              }
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            {isLoading ? (
              <LoadingSpinner size="sm" className="mx-2" />
            ) : user ? (
              <UserMenu user={user} />
            ) : (
              <AuthButtons />
            )}
          </div>

          <div className="flex items-center sm:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-controls="mobile-menu"
              aria-label="Toggle mobile menu"
            >
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div
        ref={mobileMenuRef}
        className={cn('sm:hidden', isOpen ? 'block' : 'hidden')}
        id="mobile-menu"
        role="region"
        aria-label="Mobile menu"
      >
        <div className="pt-2 pb-3 space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'block pl-3 pr-4 py-2 text-base font-medium transition-colors',
                isActive(item.href)
                  ? 'text-primary bg-primary/10'
                  : 'hover:text-primary hover:bg-primary/5',
              )}
              onClick={() => setIsOpen(false)}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {item.name}
            </Link>
          ))}
          {!isLoading && !user && (
            <div className="pt-4 pb-3 border-t border-border/40">
              <AuthButtons />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}