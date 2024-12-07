import { Code2, Rocket, Users, Zap } from 'lucide-react';

const features = [
	{
		name: 'Custom Development',
		description:
			'Tailored solutions built with cutting-edge technologies to meet your specific needs.',
		icon: Code2,
	},
	{
		name: 'Rapid Deployment',
		description: 'Quick turnaround times without compromising on quality or performance.',
		icon: Rocket,
	},
	{
		name: 'Expert Team',
		description: 'Seasoned professionals with deep expertise in various technologies and domains.',
		icon: Users,
	},
	{
		name: 'Scalable Solutions',
		description: 'Future-proof applications that grow with your business needs.',
		icon: Zap,
	},
];

export function Features() {
	return (
		<div className="py-24 sm:py-32">
			<div className="mx-auto max-w-7xl px-6 lg:px-8">
				<div className="mx-auto max-w-2xl lg:text-center">
					<h2 className="text-base font-semibold leading-7 text-primary">Why Choose Us</h2>
					<p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
						Everything you need to build amazing products
					</p>
					<p className="mt-6 text-lg leading-8 text-muted-foreground">
						We combine technical expertise with creative innovation to deliver exceptional results.
					</p>
				</div>
				<div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
					<dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-4">
						{features.map((feature) => (
							<div key={feature.name} className="flex flex-col">
								<dt className="flex items-center gap-x-3 text-base font-semibold leading-7">
									<feature.icon className="h-5 w-5 text-primary" aria-hidden="true" />
									{feature.name}
								</dt>
								<dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-muted-foreground">
									<p className="flex-auto">{feature.description}</p>
								</dd>
							</div>
						))}
					</dl>
				</div>
			</div>
		</div>
	);
}
