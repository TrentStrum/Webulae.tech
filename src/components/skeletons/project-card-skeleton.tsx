import { Card, CardContent, CardHeader } from '@/src/components/ui/card';
import { Skeleton } from '@/src/components/ui/skeleton';

export function ProjectCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-1/3" />
          <Skeleton className="h-6 w-24" />
        </div>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-3/4 mb-4" />
        <Skeleton className="h-4 w-1/4" />
      </CardContent>
    </Card>
  );
}