'use client';

import React, { useEffect, useState } from 'react';
import { PublicLayout } from '@/components/public/PublicLayout';
import { ComingSoonItem } from '@/types';
import { publicApi } from '@/lib/api';
import { Sparkles, Calendar, Rocket, Bell, CheckCircle2 } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function ComingSoonPage() {
  return (
    <PublicLayout>
      <ComingSoonContent />
    </PublicLayout>
  );
}

function ComingSoonContent() {
  const [items, setItems] = useState<ComingSoonItem[]>([]);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    publicApi.getComingSoon()
      .then((res) => {
        if (res.success && res.data) {
          setItems(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
    }
  };

  return (
    <div>
      {/* Header */}
      <section className="bg-slate-950 text-white py-16 lg:py-24 relative overflow-hidden text-center">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Rocket className="w-4 h-4" />
            <span>Future Innovations</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">
            Next-Gen Technologies Coming Soon To Jamui
          </h1>
          <p className="text-slate-300 text-base sm:text-lg">
            We are expanding our capabilities to bring smart IoT automation, enterprise network architectures, and custom business software to Jamui.
          </p>
        </div>
      </section>

      {/* Coming Soon Cards */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid md:grid-cols-3 gap-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-8 flex flex-col justify-between card-hover group shadow-sm hover:border-red-300 transition-all duration-300"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    {item.category && (
                      <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full uppercase tracking-wider">
                        {item.category}
                      </span>
                    )}
                    <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      In Development
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-red-600 transition-colors mb-3">
                    {item.title}
                  </h3>

                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {item.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Calendar className="w-4 h-4 text-red-500" />
                    <span>Expected: {formatDate(item.launch_date)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stay Notified Box */}
          <div className="mt-16 bg-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-2xl border border-slate-800 space-y-6">
            <div className="w-14 h-14 bg-red-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-red-600/30">
              <Bell className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-white">Be The First To Know</h3>
              <p className="text-slate-400 text-sm">
                Get notified when these innovative services launch with exclusive early-bird discounts in Jamui.
              </p>
            </div>

            {subscribed ? (
              <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-400 text-sm font-semibold flex items-center justify-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                <span>Thank you! We will notify you when new services launch.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email or phone"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-xl shadow-md shadow-red-600/25 transition-all"
                >
                  Notify Me
                </button>
              </form>
            )}
          </div>

        </div>
      </section>
    </div>
  );
}
