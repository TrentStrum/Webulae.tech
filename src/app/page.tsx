import { Hero } from '@/src/components/sections/hero';
import { Features } from '@/src/components/sections/features';
import { Pricing } from '@/src/components/sections/pricing';

export default function Home() {
  return (
    <main>
      <Hero />
      <Features />
      <Pricing />
    </main>
  );
}