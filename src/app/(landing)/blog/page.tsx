'use client';

import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

import { BlogPostCard } from '@/src/components/blog/BlogPostCard';
import { Filters } from '@/src/components/blog/Filters';
import { BlogPostsSkeleton } from '@/src/components/skeletons/blogPosts-skeleton';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { useBlogPosts } from '@/src/hooks/react-query/blog/queries';

export default function BlogPage(): JSX.Element {
	const [searchTerm, setSearchTerm] = useState('');
	const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');
	const [showFilters, setShowFilters] = useState(false);
	const [page, setPage] = useState(1);

	const { data, isLoading, error } = useBlogPosts({ 
		searchTerm, 
		sortBy,
		page
	});


	const { featured, categories } = data?.data || { featured: null, categories: {} };
	const { hasMore } = data?.pagination || { hasMore: false };

	const scrollCategory = (categoryId: string, direction: 'left' | 'right'): void => {
		const container = document.getElementById(`category-${categoryId}`);
		if (container) {
			const scrollAmount = direction === 'left' ? -400 : 400;
			container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
		}
	};

	return (
		<div className="container py-8 space-y-12">
			{/* Search and Filters */}
			<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
				<h1 className="text-4xl font-bold">Blog</h1>
				<div className="flex items-center gap-2 w-full sm:w-auto">
					<div className="relative flex-1 sm:flex-initial">
						<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
						<Input
							placeholder="Search posts..."
							className="pl-9 w-full"
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
					</div>
					<Button 
						variant="outline" 
						size="icon" 
						onClick={() => setShowFilters(!showFilters)}
					>
						<SlidersHorizontal className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{showFilters && <Filters sortBy={sortBy} setSortBy={setSortBy} />}

			{error ? (
				<p className="text-center text-destructive">Failed to load blog posts</p>
			) : isLoading ? (
				<BlogPostsSkeleton />
			) : !categories || Object.keys(categories).length === 0 ? (
				<p className="text-center text-muted-foreground py-8">No posts found.</p>
			) : (
				<>
					{featured && (
						<section className="mb-12">
							<BlogPostCard post={featured} variant="featured" />
						</section>
					)}

					{Object.entries(categories).map(([category, posts]) => (
						<section key={category} className="space-y-4">
							<div className="flex justify-between items-center">
								<h2 className="text-2xl font-semibold capitalize">{category}</h2>
								<div className="flex gap-2">
									<Button
										variant="outline"
										size="icon"
										onClick={() => scrollCategory(category, 'left')}
									>
										<ChevronLeft className="h-4 w-4" />
									</Button>
									<Button
										variant="outline"
										size="icon"
										onClick={() => scrollCategory(category, 'right')}
									>
										<ChevronRight className="h-4 w-4" />
									</Button>
								</div>
							</div>
							<div className="relative">
								<div
									id={`category-${category}`}
									className="flex overflow-x-auto gap-6 pb-4 scrollbar-hide snap-x snap-mandatory"
								>
									{posts.map((post) => (
										<div key={post.id} className="min-w-[300px] md:min-w-[350px] snap-start">
											<BlogPostCard post={post} />
										</div>
									))}
								</div>
							</div>
						</section>
					))}

					{hasMore && (
						<div className="flex justify-center mt-8">
							<Button
								onClick={() => setPage(p => p + 1)}
								variant="outline"
							>
								Load More
							</Button>
						</div>
					)}
				</>
			)}
		</div>
	);
}