import { motion, AnimatePresence } from 'framer-motion';

import { staggerChildren , scaleIn, listItem } from '@/src/lib/animations/variants';
import { cn } from '@/src/lib/utils';

export function AnimatedCard({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<motion.div
			variants={scaleIn}
			initial="hidden"
			animate="visible"
			className={cn('rounded-lg border bg-card p-4 shadow-sm', className)}
		>
			{children}
		</motion.div>
	);
}

export function AnimatedList<T extends { id: string }>({
	items,
	renderItem,
	className,
}: {
	items: T[];
	renderItem: (item: T) => React.ReactNode;
	className?: string;
}) {
	return (
		<motion.div variants={staggerChildren} initial="hidden" animate="visible" className={className}>
			<AnimatePresence mode="popLayout">
				{items.map((item) => (
					<motion.div
						key={item.id}
						variants={listItem}
						initial="hidden"
						animate="visible"
						exit="removed"
						layout
					>
						{renderItem(item)}
					</motion.div>
				))}
			</AnimatePresence>
		</motion.div>
	);
}

export function AnimatedTransition({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: 20 }}
			transition={{
				type: 'spring',
				stiffness: 260,
				damping: 20,
			}}
			className={className}
		>
			{children}
		</motion.div>
	);
}

export function AnimatedTabs({
	tabs,
	activeTab,
	onChange,
}: {
	tabs: string[];
	activeTab: string;
	onChange: (tab: string) => void;
}) {
	return (
		<div className="relative flex space-x-1">
			{tabs.map((tab) => (
				<button
					key={tab}
					onClick={() => onChange(tab)}
					className={cn(
						'relative px-3 py-1.5 text-sm font-medium',
						'transition-colors duration-200',
						activeTab === tab ? 'text-primary' : 'text-muted-foreground hover:text-primary'
					)}
				>
					{activeTab === tab && (
						<motion.div
							layoutId="active-tab"
							className="absolute inset-0 bg-primary/10 rounded-md"
							transition={{
								type: 'spring',
								stiffness: 500,
								damping: 30,
							}}
						/>
					)}
					<span className="relative">{tab}</span>
				</button>
			))}
		</div>
	);
}
