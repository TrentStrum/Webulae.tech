'use client';

import { Search, SlidersHorizontal } from 'lucide-react';

export default function ArticlesPage() {
	const [searchTerm, setSearchTerm] = useState('');
	const [sortBy, setSortBy] = useState('newest');
	const [showFilters, setShowFilters] = useState(false);

	const { articles, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage, refetch } =
		useArticles({ searchTerm, sortBy });

	const handleSearch = (value: string) => {
		setSearchTerm(value);
		refetch();
	};

	return (
		<div className="container py-8">
			<div className="max-w-4xl mx-auto">
				<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
					<h1 className="text-4xl font-bold">Articles</h1>
					<div className="flex items-center gap-2 w-full sm:w-auto">
						<div className="relative flex-1 sm:flex-initial">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
							<Input
								placeholder="Search articles..."
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
					<ArticleSkeleton />
				) : articles.length === 0 ? (
					<p className="text-center text-muted-foreground py-8">No articles found.</p>
				) : (
					<>
						<div className="space-y-6">
							{articles.map((article) => (
								<ArticleCard key={article.id} article={article} />
							))}
						</div>
						<div id="scroll-sentinel" className="h-4 mt-6" />
						{isFetchingNextPage && <p className="text-center py-4">Loading more articles...</p>}
					</>
				)}
			</div>
		</div>
	);
}
