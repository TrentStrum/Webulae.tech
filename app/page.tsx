import { Hero } from '@/components/sections/hero';
import { Features } from '@/components/sections/features';
import { Pricing } from '@/components/sections/pricing';

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <Pricing />
    </main>
  );
}