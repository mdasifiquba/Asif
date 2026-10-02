'use client';

import React, { useEffect, useState } from 'react';
import { PublicLayout } from '@/components/public/PublicLayout';
import { HeroSection } from '@/components/public/HeroSection';
import { StatsSection } from '@/components/public/StatsSection';
import { ServiceGrid } from '@/components/public/ServiceGrid';
import { FeaturesSection } from '@/components/public/FeaturesSection';
import { HowItWorksSection } from '@/components/public/HowItWorksSection';
import { FounderSection } from '@/components/public/FounderSection';
import { TestimonialsSection } from '@/components/public/TestimonialsSection';
import { CTASection } from '@/components/public/CTASection';
import { publicApi } from '@/lib/api';
import { HeroData, Service } from '@/types';

export default function HomePage() {
  const [heroData, setHeroData] = useState<HeroData | null>(null);

  useEffect(() => {
    publicApi.getHero()
      .then((res) => {
        if (res.success && res.data) {
          setHeroData(res.data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <PublicLayout>
      <HomePageContent heroData={heroData} />
    </PublicLayout>
  );
}

function HomePageContent({ heroData, onOpenBooking }: { heroData: HeroData | null; onOpenBooking?: (service?: Service) => void }) {
  return (
    <div className="space-y-0">
      <HeroSection heroData={heroData} onOpenBooking={() => onOpenBooking && onOpenBooking()} />
      <StatsSection />
      <ServiceGrid onBookService={(service) => onOpenBooking && onOpenBooking(service)} />
      <FeaturesSection />
      <HowItWorksSection />
      <FounderSection />
      <TestimonialsSection />
      <CTASection onOpenBooking={() => onOpenBooking && onOpenBooking()} />
    </div>
  );
}
