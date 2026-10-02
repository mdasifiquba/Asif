'use client';

import React, { useEffect, useState } from 'react';
import { Statistic } from '@/types';
import { publicApi } from '@/lib/api';
import { DynamicIcon } from '@/components/ui/IconHelper';

interface StatsSectionProps {
  initialData?: Statistic[];
}

export const StatsSection: React.FC<StatsSectionProps> = ({ initialData }) => {
  const [stats, setStats] = useState<Statistic[]>(initialData || []);

  useEffect(() => {
    if (!initialData || initialData.length === 0) {
      publicApi.getStatistics()
        .then((res) => {
          if (res.success && res.data) {
            setStats(res.data);
          }
        })
        .catch(() => {});
    }
  }, [initialData]);

  if (!stats || stats.length === 0) return null;

  return (
    <section className="relative -mt-10 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center card-hover group"
          >
            <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center mb-3 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 shadow-sm">
              <DynamicIcon name={item.icon || 'award'} className="w-6 h-6" />
            </div>
            <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
              {item.value}
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-500 mt-1 uppercase tracking-wider">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
