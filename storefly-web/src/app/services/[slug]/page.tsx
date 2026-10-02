'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { PublicLayout } from '@/components/public/PublicLayout';
import { Service } from '@/types';
import { publicApi } from '@/lib/api';
import { DynamicIcon } from '@/components/ui/IconHelper';
import { 
  CheckCircle2, 
  Calendar, 
  Phone, 
  ArrowLeft, 
  ShieldCheck, 
  Clock, 
  AlertCircle,
  HelpCircle,
  Loader2 
} from 'lucide-react';
import Link from 'next/link';

export default function ServiceDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  return (
    <PublicLayout>
      <ServiceDetailContent slug={slug} />
    </PublicLayout>
  );
}

function ServiceDetailContent({ slug, onOpenBooking }: { slug: string; onOpenBooking?: (service?: Service) => void }) {
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (slug) {
      setLoading(true);
      publicApi.getServiceBySlug(slug)
        .then((res) => {
          if (res.success && res.data) {
            setService(res.data);
          } else {
            setError('Service not found');
          }
        })
        .catch(() => {
          setError('Failed to load service details');
        })
        .finally(() => setLoading(false));
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="py-32 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-red-600 animate-spin" />
        <p className="text-slate-500 font-medium">Loading service details...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="py-28 text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Service Not Found</h2>
        <p className="text-slate-600 mb-6">The requested service could not be located or has been updated.</p>
        <Link
          href="/services"
          className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Services</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/services" className="hover:text-red-600 transition-colors">Services</Link>
          <span>/</span>
          <span className="font-semibold text-slate-900">{service.name}</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Content (Left 8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6">
              
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shrink-0 border border-red-100">
                    <DynamicIcon name={service.icon || 'wrench'} className="w-8 h-8" />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-md mb-1 inline-block">
                      {service.category_name || 'Service'}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                      {service.name}
                    </h1>
                  </div>
                </div>
              </div>

              {/* Short summary */}
              {service.short_description && (
                <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
                  {service.short_description}
                </p>
              )}

              {/* Rich Description */}
              <div className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:text-slate-600 prose-li:text-slate-600 prose-ul:my-4 prose-li:my-1">
                {service.description ? (
                  <div dangerouslySetInnerHTML={{ __html: service.description }} />
                ) : (
                  <div className="space-y-4 text-slate-600">
                    <p>We provide full-spectrum servicing, genuine component replacements, and comprehensive testing in Jamui.</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Free doorstep initial inspection</li>
                      <li>OEM certified spare parts replacement</li>
                      <li>Fast diagnosis within 24-48 hours</li>
                      <li>Service warranty and post-repair hotline support</li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Guarantee Box */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-red-50 to-rose-50 border border-red-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-8 h-8 text-red-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">NETCET Quality Guarantee</h4>
                    <p className="text-xs text-slate-600">All hardware repairs and setups include verified testing and support.</p>
                  </div>
                </div>
                <button
                  onClick={() => onOpenBooking && onOpenBooking(service)}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/25 shrink-0"
                >
                  Book Service Now
                </button>
              </div>

            </div>
          </div>

          {/* Sidebar (Right 4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Price & Booking Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Service Rate
                </span>
                <div className="text-3xl font-black text-slate-900">
                  {service.price || 'Contact for price'}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  *Transparent pricing. Exact quotation given post diagnosis.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => onOpenBooking && onOpenBooking(service)}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 transition-all flex items-center justify-center gap-2 active:scale-95"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book This Service</span>
                </button>

                <a
                  href="tel:+918210101223"
                  className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                >
                  <Phone className="w-4 h-4 text-red-600" />
                  <span>Call: +91 821 010 1223</span>
                </a>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-600">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Doorstep pickup / onsite visit in Jamui</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>Expert chip-level engineers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-red-500 shrink-0" />
                  <span>Quick turn-around &amp; live updates</span>
                </div>
              </div>
            </div>

            {/* Jamui Store Info */}
            <div className="bg-slate-900 text-white rounded-3xl p-6 space-y-4">
              <h4 className="font-bold text-base text-white">Need On-Site Inspection?</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Visit our service center near Luv Kush Gas Agency, Jamui, or book an on-site technician visit directly to your shop or residence.
              </p>
              <div className="pt-2">
                <Link
                  href="/contact"
                  className="text-xs font-bold text-red-400 hover:text-red-300 underline underline-offset-4"
                >
                  View Jamui Location &amp; Map &rarr;
                </Link>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
