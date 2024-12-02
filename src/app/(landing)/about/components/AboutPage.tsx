'use client';

import Image from 'next/image';

const AboutPage = () => {
	return (
		<div className="container mx-auto px-4 py-16">
			<div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
				<div>
					<h1 className="text-4xl font-bold mb-6">Crafting Digital Excellence</h1>
					<p className="text-lg text-muted-foreground mb-6">
						Founded in 2024, Webulae has been at the forefront of digital innovation, delivering
						cutting-edge software solutions that transform businesses. Our team of passionate
						developers, designers, and strategists work together to create exceptional digital
						experiences.
					</p>
					<p className="text-lg text-muted-foreground">
						We believe in pushing the boundaries of what&apos;s possible in software development
						while maintaining the highest standards of quality and reliability.
					</p>
				</div>
				<div className="relative h-[400px] rounded-lg overflow-hidden">
					<Image
						src="https://images.unsplash.com/photo-1522071820081-009f0129c71c"
						alt="Team collaboration"
						fill
						className="object-cover"
					/>
				</div>
			</div>

			<div className="grid md:grid-cols-3 gap-8 mb-20">
				<div className="text-center p-6">
					<h3 className="text-2xl font-bold mb-4">50+</h3>
					<p className="text-muted-foreground">Projects Completed</p>
				</div>
				<div className="text-center p-6">
					<h3 className="text-2xl font-bold mb-4">98%</h3>
					<p className="text-muted-foreground">Client Satisfaction</p>
				</div>
				<div className="text-center p-6">
					<h3 className="text-2xl font-bold mb-4">24/7</h3>
					<p className="text-muted-foreground">Support Available</p>
				</div>
			</div>

			<div className="grid lg:grid-cols-2 gap-12 items-center">
				<div className="relative h-[400px] rounded-lg overflow-hidden">
					<Image
						src="https://images.unsplash.com/photo-1553877522-43269d4ea984"
						alt="Our office"
						fill
						className="object-cover"
					/>
				</div>
				<div>
					<h2 className="text-3xl font-bold mb-6">Our Mission</h2>
					<p className="text-lg text-muted-foreground mb-6">
						At Webulae, our mission is to empower businesses through innovative software solutions.
						We strive to deliver excellence in every project, ensuring our clients stay ahead in the
						digital landscape.
					</p>
					<p className="text-lg text-muted-foreground">
						We combine technical expertise with creative thinking to solve complex challenges and
						create meaningful digital experiences that drive business growth.
					</p>
				</div>
			</div>
		</div>
	);
};

export { AboutPage };
