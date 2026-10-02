'use client';

import React, { useEffect, useState } from 'react';
import { Feature } from '@/types';
import { publicApi } from '@/lib/api';
import { DynamicIcon } from '@/components/ui/IconHelper';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export const FeaturesSection: React.FC = () => {
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    publicApi.getFeatures()
      .then((res) => {
        if (res.success && res.data) {
          setFeatures(res.data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>NETCET Advantages</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Why Choose NETCET In Jamui?
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            We deliver the highest standard of technical competence, reliable genuine components, and transparent local support.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {features.map((feature, idx) => (
            <div
              key={feature.id || idx}
              className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-red-200 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-red-600/10 text-red-600 flex items-center justify-center mb-5 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
                  <DynamicIcon name={feature.icon || 'shield'} className="w-6 h-6" />
                </div>
                {feature.badge && (
                  <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-red-600 bg-red-100/80 px-2 py-0.5 rounded-md mb-2">
                    {feature.badge}
                  </span>
                )}
                <h3 className="text-lg font-bold text-slate-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center gap-1.5 text-xs font-semibold text-red-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>NETCET Verified</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
