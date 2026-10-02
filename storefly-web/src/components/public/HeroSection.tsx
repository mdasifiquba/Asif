'use client';

import React from 'react';
import Link from 'next/link';
import { HeroData } from '@/types';
import { 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Wrench, 
  Camera, 
  Laptop, 
  Sparkles,
  PhoneCall
} from 'lucide-react';

interface HeroSectionProps {
  heroData?: HeroData | null;
  onOpenBooking?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ heroData, onOpenBooking }) => {
  const title = heroData?.title || 'Professional IT, Computer & Security Solutions in Jamui';
  const subtitle = heroData?.subtitle || 'From laptop repairs and custom PC builds to high-definition CCTV installations and biometric systems. NETCET delivers reliable, affordable, and expert technology services at your doorstep.';
  const buttonText = heroData?.button_text || 'Book a Service';

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-12 pb-20 lg:pt-20 lg:pb-28">
      {/* Background glowing effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none translate-y-1/2" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Location & Trust Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-xs sm:text-sm font-semibold backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-red-400 animate-pulse" />
              <span>Jamui&apos;s #1 IT &amp; Security Services Hub</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
              {title}
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-base sm:text-lg lg:text-xl font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              {subtitle}
            </p>

            {/* Key Assurance Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs sm:text-sm text-slate-300 font-medium justify-center lg:justify-start">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>Doorstep Pickup &amp; Visit</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>100% Genuine Spares</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0" />
                <span>Fast &amp; Verified Support</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 justify-center lg:justify-start">
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-600 via-red-500 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold rounded-xl shadow-xl shadow-red-600/30 hover:shadow-red-600/50 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 text-base"
              >
                <span>{buttonText}</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              <Link
                href="/services"
                className="w-full sm:w-auto px-8 py-4 bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-semibold rounded-xl border border-slate-700/80 backdrop-blur-md transition-all flex items-center justify-center gap-2 text-base hover:border-slate-600"
              >
                <span>View All Services</span>
              </Link>
            </div>
          </div>

          {/* Right Visual Card */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Decorative Glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-red-600 to-rose-600 rounded-3xl blur-xl opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
              
              {/* Feature Showcase Card */}
              <div className="relative bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">Popular Solutions</h3>
                    <p className="text-xs text-slate-400">Expert on-demand assistance</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-full flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Live in Jamui
                  </span>
                </div>

                {/* Service Cards inside visual */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center gap-4 hover:border-red-500/40 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center shrink-0 border border-red-500/20">
                      <Laptop className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-sm">Laptop &amp; PC Repairs</h4>
                        <span className="text-xs font-bold text-red-400">From ₹299</span>
                      </div>
                      <p className="text-xs text-slate-400">Motherboard chip level repair, screen, SSD upgrade</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center gap-4 hover:border-red-500/40 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 border border-blue-500/20">
                      <Camera className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-sm">CCTV &amp; Surveillance</h4>
                        <span className="text-xs font-bold text-blue-400">From ₹1,500</span>
                      </div>
                      <p className="text-xs text-slate-400">HD / IP Camera installation, mobile live view</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center gap-4 hover:border-red-500/40 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center shrink-0 border border-rose-500/20">
                      <ShieldCheck className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-white text-sm">Biometrics &amp; Access</h4>
                        <span className="text-xs font-bold text-rose-400">From ₹3,000</span>
                      </div>
                      <p className="text-xs text-slate-400">Fingerprint &amp; face attendance for schools &amp; shops</p>
                    </div>
                  </div>
                </div>

                {/* Instant Hotline banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/60 to-slate-800 border border-red-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-red-600 text-white shadow-md shadow-red-600/30">
                      <PhoneCall className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Need Immediate Help?</p>
                      <p className="text-sm font-bold text-white">Call Jamui Helpline</p>
                    </div>
                  </div>
                  <a
                    href="tel:+918210101223"
                    className="px-3.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-bold transition-colors"
                  >
                    Call Now
                  </a>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
