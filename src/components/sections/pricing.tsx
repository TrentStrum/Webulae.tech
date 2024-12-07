import { Check } from 'lucide-react';

import { cn } from '@/src/utils/utils';

import { Button } from '../ui/button';

const tiers = [
	{
		name: 'Starter',
		price: 2999,
		description: 'Perfect for small businesses and startups.',
		features: [
			'Custom Website Development',
			'Responsive Design',
			'Basic SEO Setup',
			'3 Months Support',
		],
	},
	{
		name: 'Professional',
		price: 4999,
		description: 'Ideal for growing businesses.',
		features: [
			'Everything in Starter',
			'E-commerce Integration',
			'Advanced SEO',
			'Priority Support',
			'Performance Optimization',
		],
	},
	{
		name: 'Enterprise',
		price: null,
		description: 'For large-scale applications.',
		features: [
			'Everything in Professional',
			'Custom Feature Development',
			'Dedicated Support Team',
			'Cloud Infrastructure Setup',
			'Regular Security Audits',
		],
	},
];

export function Pricing() {
	return (
		<div className="py-24 sm:py-32">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto max-w-2xl sm:text-center mb-16">
					<h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Pricing Plans</h2>
					<p className="mt-6 text-lg leading-8 text-muted-foreground">
						Choose the perfect plan for your needs. All plans include our core features.
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
					{tiers.map((tier, index) => {
						const isMiddleTier = index === 1;

						return (
							<div
								key={tier.name}
								className={cn(
									'relative rounded-2xl ring-1 ring-border/50 backdrop-blur-sm',
									'flex flex-col p-8',
									'transition-all duration-300 hover:ring-primary/50 hover:shadow-lg hover:shadow-primary/10',
									isMiddleTier ? 'md:scale-105 bg-secondary/10' : 'bg-card/50'
								)}
							>
								{isMiddleTier && (
									<div className="absolute -top-5 left-0 right-0 mx-auto w-fit px-4 py-1 rounded-full bg-primary/20 text-primary text-sm font-medium">
										Most Popular
									</div>
								)}

								<div className="mb-8">
									<h3 className="text-2xl font-bold">{tier.name}</h3>
									<p className="mt-4 text-muted-foreground">{tier.description}</p>
									<div className="mt-6 flex items-baseline gap-x-2">
										{tier.price ? (
											<>
												<span className="text-5xl font-bold tracking-tight">${tier.price}</span>
												<span className="text-sm font-semibold leading-6 text-muted-foreground">
													/project
												</span>
											</>
										) : (
											<span className="text-2xl font-bold tracking-tight">Custom Quote</span>
										)}
									</div>
								</div>

								<ul className="mb-8 space-y-3 text-sm leading-6 text-muted-foreground flex-grow">
									{tier.features.map((feature) => (
										<li key={feature} className="flex gap-x-3 items-center">
											<Check className="h-5 w-5 flex-none text-primary" aria-hidden="true" />
											{feature}
										</li>
									))}
								</ul>

								<Button
									className={cn(
										'w-full',
										isMiddleTier ? 'bg-primary text-primary-foreground hover:bg-primary/90' : ''
									)}
									variant={isMiddleTier ? 'default' : 'outline'}
								>
									Get started
								</Button>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
