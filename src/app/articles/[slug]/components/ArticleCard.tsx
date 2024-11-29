'use client';

import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Article } from "@/src/types";
import { formatDistanceToNow } from "date-fns";


type Props = {
	article: Article;
}

export function ArticleCard({ article }: Props) {
	return (
		<Card className="transition-shadow hover:shadow-lg">
			<CardHeader>
				<CardTitle>
					<a href={`/articles/${article.slug}`} className="hover:text-primary transition-colors">
						{article.title}
					</a>
				</CardTitle>
			</CardHeader>
			<CardContent>
				<p className="text-muted-foreground mb-4">{article.excerpt}</p>
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<span>By {article.profiles?.full_name || article.profiles?.username || 'Anonymous'}</span>
					<span>•</span>
					<time dateTime={article.published_at || undefined}>
						{article.published_at &&
							formatDistanceToNow(new Date(article.published_at), { addSuffix: true })}
					</time>
				</div>
			</CardContent>
		</Card>
	);
}
