'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { ContactMessage } from '@/types';
import { 
  MessageSquare, 
  Trash2, 
  CheckCircle, 
  Phone, 
  Mail, 
  Clock, 
  Loader2, 
  RefreshCw 
} from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMessages = () => {
    setLoading(true);
    adminApi.getMessages()
      .then((res) => {
        if (res.success && res.data) {
          setMessages(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      const res = await adminApi.updateMessageStatus(id, status);
      if (res.success) {
        setMessages(messages.map(m => m.id === id ? { ...m, status: status as any } : m));
      }
    } catch {
      alert('Failed to update message status.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this enquiry?')) return;
    try {
      const res = await adminApi.deleteMessage(id);
      if (res.success) {
        setMessages(messages.filter(m => m.id !== id));
      }
    } catch {
      alert('Failed to delete enquiry.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 border border-slate-800 rounded-3xl p-6">
        <div>
          <h1 className="text-2xl font-black text-white">Contact Enquiries</h1>
          <p className="text-xs text-slate-400 mt-1">Direct inquiries and support questions received from NETCET website</p>
        </div>
        <button
          onClick={fetchMessages}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-700 self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
          <p className="text-xs text-slate-500">Loading messages...</p>
        </div>
      ) : messages.length === 0 ? (
        <div className="py-16 text-center bg-slate-950 border border-slate-800 rounded-2xl">
          <p className="text-xs text-slate-400">No contact messages received yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`p-6 rounded-3xl bg-slate-950 border transition-all ${
                m.status === 'new' ? 'border-red-500/40 shadow-lg shadow-red-950/20' : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-base text-white">{m.name}</span>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase ${
                    m.status === 'new' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                    m.status === 'read' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                    'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {m.status}
                  </span>
                </div>

                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span>{formatDateTime(m.created_at)}</span>
                  <button
                    onClick={() => handleDelete(m.id)}
                    className="p-1.5 text-slate-500 hover:text-red-400 rounded-lg transition-colors"
                    title="Delete Message"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-red-400" />
                    <a href={`tel:${m.phone}`} className="text-white hover:underline font-mono">
                      {m.phone}
                    </a>
                  </div>
                  {m.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-400" />
                      <a href={`mailto:${m.email}`} className="text-white hover:underline">
                        {m.email}
                      </a>
                    </div>
                  )}
                  {m.subject && (
                    <div className="text-slate-300">
                      <span className="text-slate-500">Subject:</span> {m.subject}
                    </div>
                  )}
                </div>

                <p className="text-sm text-slate-200 bg-slate-900/80 p-4 rounded-2xl border border-slate-800/80 whitespace-pre-wrap">
                  {m.message}
                </p>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <a
                    href={`https://wa.me/${m.phone.replace(/[^0-9]/g, '')}?text=Hi%20${encodeURIComponent(m.name)},%20thank%20you%20for%20contacting%20NETCET.`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-bold rounded-xl border border-emerald-500/30 transition-colors"
                  >
                    WhatsApp Reply
                  </a>
                  {m.status !== 'replied' && (
                    <button
                      onClick={() => handleUpdateStatus(m.id, 'replied')}
                      className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-colors"
                    >
                      Mark as Replied
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
