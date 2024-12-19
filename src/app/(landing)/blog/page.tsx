'use client';

import { Search, SlidersHorizontal, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

import { BlogPostCard } from '@/src/components/blog/BlogPostCard';
import { Filters } from '@/src/components/blog/Filters';
import { BlogPostsSkeleton } from '@/src/components/skeletons/blogPosts-skeleton';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { useBlogPosts } from '@/src/hooks/react-query/useBlog';

import type { BlogResponse } from '@/src/hooks/react-query/useBlog';
import type { BlogPost } from '@/src/types/blog.types';

export default function BlogPage() {
	const [searchTerm, setSearchTerm] = useState('');
	const [sortBy, setSortBy] = useState('newest');
	const [showFilters, setShowFilters] = useState(false);

	const {
		data: blogPosts,
		isLoading,
		isFetchingNextPage,
		hasNextPage,
		fetchNextPage,
		refetch,
		error,
	} = useBlogPosts({ searchTerm, sortBy });

	useEffect(() => {
		if (error) {
			console.error('Blog posts error:', error);
		}
	}, [error]);

	console.log('Raw blogPosts data:', blogPosts);

	// Fix the type error by properly typing the data
	const posts = blogPosts?.pages?.flatMap((page: BlogResponse) => {
		const allPosts: BlogPost[] = [];
		if (page.data.featured) allPosts.push(page.data.featured);
		Object.values(page.data.categories).forEach(categoryPosts => {
			allPosts.push(...categoryPosts);
		});
		return allPosts;
	}) || [];
	console.log('Flattened posts:', posts);

	const featuredPost = blogPosts?.pages?.[0]?.data.featured;
	console.log('Featured post:', featuredPost);

	const remainingPosts = posts.slice(1);
	console.log('Remaining posts:', remainingPosts);

	// Fix the reduce function types
	const postsByCategory = blogPosts?.pages?.reduce((acc, page) => {
		Object.entries(page.data.categories).forEach(([category, posts]) => {
			if (!acc[category]) acc[category] = [];
			acc[category].push(...posts);
		});
		return acc;
	}, {} as Record<string, BlogPost[]>) || {};

	console.log('Posts grouped by category:', postsByCategory);

	const handleSearch = (value: string) => {
		setSearchTerm(value);
		refetch();
	};

	const scrollCategory = (categoryId: string, direction: 'left' | 'right') => {
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
							onChange={(e) => handleSearch(e.target.value)}
						/>
					</div>
					<Button variant="outline" size="icon" onClick={() => setShowFilters(!showFilters)}>
						<SlidersHorizontal className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{showFilters && <Filters sortBy={sortBy} setSortBy={setSortBy} />}

			{isLoading ? (
				<BlogPostsSkeleton />
			) : !posts.length ? (
				<p className="text-center text-muted-foreground py-8">No posts found.</p>
			) : (
				<>
					{/* Featured Post */}
					{featuredPost && (
						<section className="mb-12">
							<BlogPostCard post={featuredPost} variant="featured" />
						</section>
					)}

					{/* Posts by Category */}
					{(Object.entries(postsByCategory) as [string, BlogPost[]][]).map(([category, categoryPosts]) => (
						<section key={category} className="space-y-4">
							<div className="flex justify-between items-center">
								<h2 className="text-2xl font-semibold">{category}</h2>
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
									{categoryPosts.map((post: BlogPost) => (
										<div key={post.id} className="min-w-[300px] md:min-w-[350px] snap-start">
											<BlogPostCard post={post} />
										</div>
									))}
								</div>
							</div>
						</section>
					))}

					{/* Load More Button */}
					{hasNextPage && (
						<div className="flex justify-center mt-8">
							<Button
								onClick={() => fetchNextPage()}
								disabled={isFetchingNextPage}
								variant="outline"
							>
								{isFetchingNextPage ? 'Loading more...' : 'Load More'}
							</Button>
						</div>
					)}
				</>
			)}
		</div>
	);
}
