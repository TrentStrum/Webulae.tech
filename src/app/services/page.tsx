'use client';

import Image from 'next/image';
import { Button } from '@/src/components/ui/button';
import { services } from './constants/services';

export default function ServicesPage() {
	return (
		<div className="container mx-auto px-4 py-16">
			<div className="text-center mb-16">
				<h1 className="text-4xl font-bold mb-6">Our Services</h1>
				<p className="text-lg text-muted-foreground max-w-2xl mx-auto">
					We offer a comprehensive range of software development services to help your business
					thrive in the digital age.
				</p>
			</div>

			<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
				{services?.map((service, index) => (
					<div key={index} className="group relative overflow-hidden rounded-lg">
						<div className="relative h-64 mb-4">
							<Image
								src={service.image}
								alt={service.title}
								fill
								className="object-cover transition-transform group-hover:scale-105"
							/>
							<div className="absolute inset-0 bg-black/50 flex items-center justify-center">
								<service.icon className="h-16 w-16 text-white" />
							</div>
						</div>
						<h3 className="text-xl font-bold mb-2">{service.title}</h3>
						<p className="text-muted-foreground mb-4">{service.description}</p>
						<Button variant="outline" className="w-full">
							Learn More
						</Button>
					</div>
				))}
			</div>
		</div>
	);
}
