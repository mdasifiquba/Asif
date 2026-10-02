'use client';

import React from 'react';
import { Phone, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

interface CTASectionProps {
  onOpenBooking?: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onOpenBooking }) => {
  return (
    <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-red-600/20 to-rose-600/20 rounded-full blur-3xl pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-900/40 via-slate-900/90 to-red-950/40 border border-red-500/30 rounded-3xl p-8 sm:p-12 lg:p-16 text-center space-y-8 backdrop-blur-xl shadow-2xl">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-xs sm:text-sm font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Fast Emergency Support Across Jamui</span>
          </div>

          <h2 className="text-3xl sm:text-5xl font-black tracking-tight max-w-3xl mx-auto leading-tight">
            Ready To Upgrade Your IT Systems Or Secure Your Premises?
          </h2>

          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto">
            Book an engineer visit today or call us for free consultation, quotation, and quick doorstep diagnosis.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={onOpenBooking}
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold rounded-xl shadow-xl shadow-red-600/40 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2 text-base"
            >
              <Calendar className="w-5 h-5" />
              <span>Book A Service Visit</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <a
              href="tel:+918210101223"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2 text-base"
            >
              <Phone className="w-5 h-5 text-red-400" />
              <span>Call: +91 821 010 1223</span>
            </a>
          </div>

        </div>
      </div>
    </section>
  );
};
