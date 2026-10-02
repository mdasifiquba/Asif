'use client';

import React, { useEffect, useState } from 'react';
import { Founder } from '@/types';
import { publicApi } from '@/lib/api';
import { UserCheck, Award, Quote, CheckCircle2, Shield } from 'lucide-react';

export const FounderSection: React.FC = () => {
  const [founder, setFounder] = useState<Founder | null>(null);

  useEffect(() => {
    publicApi.getFounder()
      .then((res) => {
        if (res.success && res.data) {
          setFounder(res.data);
        }
      })
      .catch(() => {});
  }, []);

  if (!founder) return null;

  const skillsList = founder.skills ? founder.skills.split(',').map(s => s.trim()) : [
    'Chip-level Motherboard Repair',
    'Enterprise CCTV Deployment',
    'Biometric Attendance Systems',
    'Network Architecture',
    'Custom High-End PC Builds'
  ];

  return (
    <section className="py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 lg:p-16 shadow-xl shadow-slate-200/40 relative overflow-hidden">
          {/* Subtle background graphics */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-red-500/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            
            {/* Founder Avatar & Experience Badge */}
            <div className="lg:col-span-5 flex flex-col items-center text-center">
              <div className="relative">
                {/* Photo frame */}
                <div className="w-48 h-48 sm:w-56 sm:h-56 rounded-3xl bg-gradient-to-tr from-red-600 via-rose-600 to-slate-900 p-1 shadow-2xl shadow-red-600/20">
                  <div className="w-full h-full rounded-[22px] bg-slate-900 flex flex-col items-center justify-center text-white overflow-hidden relative">
                    <UserCheck className="w-24 h-24 text-red-400 mb-2 opacity-90" />
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
                      NETCET Lead
                    </span>
                  </div>
                </div>

                {/* Experience floating badge */}
                <div className="absolute -bottom-4 bg-red-600 text-white px-4 py-2 rounded-2xl shadow-lg shadow-red-600/30 flex items-center gap-2 text-xs sm:text-sm font-bold border-2 border-white">
                  <Award className="w-4 h-4" />
                  <span>{founder.experience_years || '8+ Years Exp'}</span>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="text-2xl font-black text-slate-900">{founder.name}</h3>
                <p className="text-sm font-semibold text-red-600">{founder.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">NETCET COMPUTERS - CCTV IT AND COMPUTER, Jamui</p>
              </div>
            </div>

            {/* Founder Bio & Quote */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider">
                <Shield className="w-4 h-4" />
                <span>Meet The Founder &amp; Lead Engineer</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-snug">
                Dedicated to Bringing World-Class IT &amp; Security Expertise to Jamui
              </h2>

              <p className="text-slate-600 text-base leading-relaxed">
                {founder.bio}
              </p>

              {founder.quote && (
                <div className="p-5 rounded-2xl bg-red-50/60 border-l-4 border-red-600 italic text-slate-700 text-sm sm:text-base relative flex items-start gap-3">
                  <Quote className="w-6 h-6 text-red-500 shrink-0 opacity-40 mt-1" />
                  <p>&ldquo;{founder.quote}&rdquo;</p>
                </div>
              )}

              {/* Core Skills & Specializations */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">Core Expertise &amp; Certifications</h4>
                <div className="flex flex-wrap gap-2">
                  {skillsList.map((skill, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-medium border border-slate-200"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-red-600" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
