'use client';

import Link from 'next/link';
import { cn } from '@/src/utils/utils';
import { useNavigation } from '@/src/hooks/helpers/use-navigation';

interface NavbarDesktopLinksProps {
  items: Array<{ name: string; href: string; }>;
}

export function NavbarDesktopLinks({ items }: NavbarDesktopLinksProps) {
  const { isActive } = useNavigation();

  return (
    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors',
            isActive(item.href)
              ? 'text-primary border-b-2 border-primary'
              : 'hover:text-primary'
          )}
          aria-current={isActive(item.href) ? 'page' : undefined}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}