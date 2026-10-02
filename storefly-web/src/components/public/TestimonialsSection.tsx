'use client';

import React, { useEffect, useState } from 'react';
import { Testimonial } from '@/types';
import { publicApi } from '@/lib/api';
import { Star, MessageSquare, MapPin } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    publicApi.getTestimonials()
      .then((res) => {
        if (res.success && res.data) {
          setTestimonials(res.data);
        }
      })
      .catch(() => {});
  }, []);

  if (testimonials.length === 0) return null;

  return (
    <section className="py-20 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider">
            <MessageSquare className="w-4 h-4" />
            <span>Customer Feedback</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            What Our Clients Say
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Read authentic reviews from homeowners, business owners, and schools across Jamui.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6 flex flex-col justify-between card-hover group"
            >
              <div>
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < (t.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-slate-700 text-sm leading-relaxed mb-6 italic">
                  &ldquo;{t.review}&rdquo;
                </p>
              </div>

              {/* Author Info */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{t.customer_name}</h4>
                  {t.customer_role && (
                    <p className="text-xs text-slate-500">{t.customer_role}</p>
                  )}
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 bg-white px-2 py-1 rounded-md border border-slate-200">
                  <MapPin className="w-3 h-3 text-red-500" />
                  {t.location || 'Jamui'}
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
