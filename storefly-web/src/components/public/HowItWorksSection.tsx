'use client';

import React, { useEffect, useState } from 'react';
import { HowItWorks } from '@/types';
import { publicApi } from '@/lib/api';
import { DynamicIcon } from '@/components/ui/IconHelper';
import { ArrowRight, Workflow } from 'lucide-react';

export const HowItWorksSection: React.FC = () => {
  const [steps, setSteps] = useState<HowItWorks[]>([]);

  useEffect(() => {
    publicApi.getHowItWorks()
      .then((res) => {
        if (res.success && res.data) {
          setSteps(res.data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-20 bg-slate-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider">
            <Workflow className="w-4 h-4" />
            <span>Simple 3-Step Process</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            How It Works
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            Getting your computer repaired or CCTV installed in Jamui has never been easier.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {steps.map((step, idx) => (
            <div
              key={step.id || idx}
              className="relative bg-slate-800/80 border border-slate-700/80 rounded-2xl p-8 backdrop-blur-sm flex flex-col justify-between group hover:border-red-500/50 transition-all duration-300"
            >
              <div>
                {/* Step badge */}
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                    <DynamicIcon name={step.icon || 'wrench'} className="w-6 h-6" />
                  </div>
                  <span className="text-3xl font-black text-slate-700 group-hover:text-red-500/40 transition-colors">
                    0{step.step_number || idx + 1}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-400 transition-colors">
                  {step.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 z-10">
                  <div className="w-8 h-8 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center border border-slate-600">
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
