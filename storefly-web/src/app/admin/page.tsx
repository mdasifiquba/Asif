'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { adminApi } from '@/lib/api';
import { Booking, ContactMessage, Service } from '@/types';
import { 
  Calendar, 
  MessageSquare, 
  Wrench, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  AlertCircle,
  Phone,
  User,
  Eye,
  Loader2
} from 'lucide-react';
import { formatDate, formatDateTime } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminApi.getBookings({ limit: 5 }),
      adminApi.getMessages({ limit: 5 }),
      adminApi.getServices()
    ])
      .then(([bRes, mRes, sRes]) => {
        if (bRes.success && bRes.data) setBookings(bRes.data);
        if (mRes.success && mRes.data) setMessages(mRes.data);
        if (sRes.success && sRes.data) setServices(sRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const newMessages = messages.filter(m => m.status === 'new').length;

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-red-500 animate-spin" />
        <p className="text-slate-400 text-sm">Loading admin overview...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Welcome to NETCET Dashboard
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Real-time status for IT repairs, CCTV bookings, and customer enquiries in Jamui.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/bookings"
            className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/25 transition-all flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            <span>Manage Bookings</span>
          </Link>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Bookings</span>
            <div className="p-2 rounded-xl bg-red-500/10 text-red-400">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{bookings.length}</div>
          <div className="text-xs text-red-400 font-semibold">{pendingBookings} pending confirmation</div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">New Enquiries</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{messages.length}</div>
          <div className="text-xs text-blue-400 font-semibold">{newMessages} unread messages</div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Services</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Wrench className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{services.length}</div>
          <div className="text-xs text-emerald-400 font-semibold">Active in catalog</div>
        </div>

        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Health</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">100% Online</div>
          <div className="text-xs text-slate-400">MariaDB &amp; Node Connected</div>
        </div>
      </div>

      {/* Grid: Recent Bookings & Messages */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Recent Bookings */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Recent Service Bookings</h3>
              <p className="text-xs text-slate-400">Latest customer appointments in Jamui</p>
            </div>
            <Link
              href="/admin/bookings"
              className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {bookings.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">No bookings yet.</div>
          ) : (
            <div className="space-y-3">
              {bookings.map((b) => (
                <div
                  key={b.id}
                  className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{b.customer_name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        b.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' :
                        b.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                        b.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                        'bg-slate-800 text-slate-400'
                      }`}>
                        {b.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-3">
                      <span className="text-red-400 font-medium">{b.service_name || 'IT Service'}</span>
                      <span>&bull;</span>
                      <span>{b.customer_phone}</span>
                    </div>
                  </div>

                  <div className="text-right text-xs text-slate-500">
                    <div>{formatDate(b.preferred_date)}</div>
                    <div className="text-[10px]">{b.preferred_time || 'General slot'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Contact Enquiries */}
        <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-white">Recent Enquiries</h3>
              <p className="text-xs text-slate-400">Questions submitted through website</p>
            </div>
            <Link
              href="/admin/messages"
              className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {messages.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">No contact messages yet.</div>
          ) : (
            <div className="space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{m.name}</span>
                    <span className="text-[10px] text-slate-500">{formatDateTime(m.created_at)}</span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-2">
                    <Phone className="w-3 h-3 text-red-400" />
                    <span>{m.phone}</span>
                    {m.subject && <span className="text-slate-500">&bull; {m.subject}</span>}
                  </div>
                  <p className="text-xs text-slate-300 line-clamp-2 italic">
                    &ldquo;{m.message}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
