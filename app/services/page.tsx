import Image from 'next/image';
import { Code2, Database, Globe, Smartphone, Gauge, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

const services = [
  {
    title: 'Web Development',
    description: 'Custom websites and web applications built with modern technologies.',
    icon: Globe,
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f'
  },
  {
    title: 'Mobile Development',
    description: 'Native and cross-platform mobile applications for iOS and Android.',
    icon: Smartphone,
    image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c'
  },
  {
    title: 'Backend Development',
    description: 'Scalable server solutions and API development.',
    icon: Database,
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31'
  },
  {
    title: 'Custom Software',
    description: 'Tailored software solutions for your specific business needs.',
    icon: Code2,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3'
  },
  {
    title: 'Performance Optimization',
    description: 'Speed up your applications and improve user experience.',
    icon: Gauge,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71'
  },
  {
    title: 'Security Solutions',
    description: 'Protect your applications with advanced security measures.',
    icon: Shield,
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb'
  }
];

export default function Services() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">Our Services</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          We offer a comprehensive range of software development services to help 
          your business thrive in the digital age.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {services.map((service, index) => (
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