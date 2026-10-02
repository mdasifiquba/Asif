'use client';

import React from 'react';
import { PublicLayout } from '@/components/public/PublicLayout';
import { FounderSection } from '@/components/public/FounderSection';
import { FeaturesSection } from '@/components/public/FeaturesSection';
import { StatsSection } from '@/components/public/StatsSection';
import { CTASection } from '@/components/public/CTASection';
import { ShieldCheck, Target, HeartHandshake, Award } from 'lucide-react';
import { Service } from '@/types';

export default function AboutPage() {
  return (
    <PublicLayout>
      <AboutContent />
    </PublicLayout>
  );
}

function AboutContent({ onOpenBooking }: { onOpenBooking?: (service?: Service) => void }) {
  return (
    <div>
      {/* Page Hero Header */}
      <section className="bg-slate-950 text-white py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4" />
            <span>About NETCET Jamui</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Empowering Jamui With Reliable IT &amp; Security Services
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Established with a vision to provide authentic, high-precision computer hardware repairs, advanced surveillance, and seamless biometric automation for homes, offices, and institutions in Bihar.
          </p>
        </div>
      </section>

      {/* Stats Counter */}
      <div className="-mt-8">
        <StatsSection />
      </div>

      {/* Mission & Vision Cards */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-red-600/10 text-red-600 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Our Mission</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                To deliver fast, transparent, and affordable technology support to every resident and enterprise in Jamui, eliminating the need to travel to large metro cities for chip-level repairs.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-600 flex items-center justify-center">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Honest &amp; Transparent</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                We believe in genuine spare parts, transparent diagnosis reports, and pre-approved quotations. No hidden fees or inflated replacement costs.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200/80 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Certified Quality</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Every repair and surveillance setup is executed by trained technicians backed by a post-service warranty and dedicated hotline support.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Spotlight */}
      <FounderSection />

      {/* Features */}
      <FeaturesSection />

      {/* CTA */}
      <CTASection onOpenBooking={() => onOpenBooking && onOpenBooking()} />
    </div>
  );
}
