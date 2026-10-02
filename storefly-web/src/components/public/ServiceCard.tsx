'use client';

import React from 'react';
import Link from 'next/link';
import { Service } from '@/types';
import { DynamicIcon } from '@/components/ui/IconHelper';
import { ArrowRight, Calendar } from 'lucide-react';

interface ServiceCardProps {
  service: Service;
  onBook?: (service: Service) => void;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service, onBook }) => {
  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between group hover:border-red-500/40 hover:shadow-2xl hover:shadow-red-950/20 transition-all duration-300">
      <div>
        {/* Header with Red Icon & Category Pill */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center border border-red-500/20 group-hover:bg-red-600 group-hover:text-white transition-all duration-300 shadow-sm">
            <DynamicIcon name={service.icon || 'wrench'} className="w-6 h-6" />
          </div>
          {service.category_name && (
            <span className="text-[10px] font-bold text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full uppercase tracking-wider border border-slate-700/50">
              {service.category_name}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors mb-1">
          {service.name}
        </h3>

        {/* Price */}
        <div className="text-base font-bold text-red-500 mb-3">
          {service.price ? (service.price.startsWith('?') ? `₹${service.price.slice(1)}` : service.price) : 'Price on request'}
        </div>

        {/* Short description */}
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-6">
          {service.short_description || 'Professional and reliable IT & security support services in Jamui.'}
        </p>
      </div>

      {/* Bottom Bar with Status & Actions */}
      <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] text-slate-300">Available</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/services/${service.slug}`}
            className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-xl transition-colors border border-slate-700/60 flex items-center gap-1"
          >
            <span>Details</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
          <button
            onClick={() => onBook && onBook(service)}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/25 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Calendar className="w-3 h-3" />
            <span>Book</span>
          </button>
        </div>
      </div>
    </div>
  );
};
