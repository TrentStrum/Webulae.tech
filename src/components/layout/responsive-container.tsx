import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';

import { Button } from '@/src/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/src/components/ui/sheet';
import { cn } from '@/src/lib/utils';


interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export function ResponsiveContainer({
  children,
  className,
  animate = true,
}: ResponsiveContainerProps): JSX.Element {
  const Wrapper = animate ? motion.div : 'div';

  return (
    <Wrapper
      className={cn(
        // Base styles
        'w-full mx-auto px-4',
        // Responsive padding
        'sm:px-6 lg:px-8',
        // Responsive max-width
        'max-w-7xl',
        // Custom classes
        className
      )}
      {...(animate && {
        initial: 'hidden',
        animate: 'visible',
        variants: {
          hidden: { opacity: 0 },
          visible: { opacity: 1 },
        },
      })}
    >
      {children}
    </Wrapper>
  );
}

export function ResponsiveGrid({
  children,
  className,
  minWidth = '250px',
}: {
  children: React.ReactNode;
  className?: string;
  minWidth?: string;
}) {
  return (
    <div
      className={cn(
        'grid gap-4',
        'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
        className
      )}
      style={{
        gridTemplateColumns: `repeat(auto-fill, minmax(${minWidth}, 1fr))`,
      }}
    >
      {children}
    </div>
  );
}

export function ResponsiveSidebar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <>
      {/* Desktop sidebar */}
      <div
        className={cn(
          'hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col',
          className
        )}
      >
        {children}
      </div>

      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" className="lg:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            {children}
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
} 