'use client';

import React from 'react';
import { PublicLayout } from '@/components/public/PublicLayout';
import { ServiceGrid } from '@/components/public/ServiceGrid';
import { FeaturesSection } from '@/components/public/FeaturesSection';
import { CTASection } from '@/components/public/CTASection';
import { Wrench } from 'lucide-react';
import { Service } from '@/types';

export default function ServicesPage() {
  return (
    <PublicLayout>
      <ServicesContent />
    </PublicLayout>
  );
}

function ServicesContent({ onOpenBooking }: { onOpenBooking?: (service?: Service) => void }) {
  return (
    <div>
      {/* Header */}
      <section className="bg-slate-950 text-white py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl relative">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Wrench className="w-4 h-4" />
            <span>Complete Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Our IT &amp; Security Services in Jamui
          </h1>
          <p className="text-slate-300 text-base sm:text-lg">
            Explore our comprehensive suite of hardware diagnostics, computer repairs, HD CCTV surveillance, biometric automation, and networking setups.
          </p>
        </div>
      </section>

      {/* Main Service Grid with filters */}
      <ServiceGrid 
        showFilters={true} 
        title="Browse All Services" 
        subtitle="Select any service to view comprehensive features, pricing, or book an instant appointment." 
        onBookService={(service) => onOpenBooking && onOpenBooking(service)} 
      />

      {/* Features */}
      <FeaturesSection />

      {/* CTA */}
      <CTASection onOpenBooking={() => onOpenBooking && onOpenBooking()} />
    </div>
  );
}
