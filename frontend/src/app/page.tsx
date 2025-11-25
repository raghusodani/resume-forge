'use client';

import { AnimatedBackground } from '@/components/landing/AnimatedBackground';
import { Navigation } from '@/components/landing/Navigation';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeatureGrid } from '@/components/landing/FeatureGrid';
import { Footer } from '@/components/landing/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden selection:bg-cyan-500/30">
      <AnimatedBackground />
      <Navigation />
      <main className="relative">
        <HeroSection />
        <FeatureGrid />
      </main>
      <Footer />
    </div>
  );
}
