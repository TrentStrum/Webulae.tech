import { ProjectCardSkeleton } from '@/components/skeletons/project-card-skeleton';

export default function Loading() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">My Projects</h1>
      <div className="grid gap-6">
        {[1, 2, 3].map((i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}