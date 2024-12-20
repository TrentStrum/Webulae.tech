export function HeroSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between gap-8 py-12">
      {/* Left side - Text content */}
      <div className="flex-1 space-y-6">
        <div className="space-y-4">
          <div className="h-12 w-3/4 bg-muted animate-pulse rounded-lg" /> {/* Title */}
          <div className="h-8 w-1/2 bg-muted animate-pulse rounded-lg" /> {/* Subtitle */}
        </div>
        <div className="space-y-3"> {/* Description paragraphs */}
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
          <div className="h-4 w-5/6 bg-muted animate-pulse rounded" />
          <div className="h-4 w-4/6 bg-muted animate-pulse rounded" />
        </div>
        <div className="flex gap-4 pt-4"> {/* CTA Buttons */}
          <div className="h-10 w-32 bg-muted animate-pulse rounded-lg" />
          <div className="h-10 w-32 bg-muted animate-pulse rounded-lg" />
        </div>
      </div>

      {/* Right side - Image placeholder */}
      <div className="flex-1">
        <div className="aspect-video w-full bg-muted animate-pulse rounded-lg" />
      </div>
    </div>
  );
} 