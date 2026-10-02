'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { Statistic } from '@/types';
import { Layers, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/IconHelper';

export default function AdminStatisticsPage() {
  const [stats, setStats] = useState<Statistic[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminApi.getStatistics()
      .then((res) => {
        if (res.success && res.data) setStats(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...stats];
    updated[index] = { ...updated[index], [field]: value };
    setStats(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      for (const item of stats) {
        await adminApi.updateStatistic(item.id, item);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Failed to save statistics.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        <p className="text-xs text-slate-500">Loading statistics...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 border border-slate-800 rounded-3xl p-6">
        <div>
          <h1 className="text-2xl font-black text-white">Homepage Statistics</h1>
          <p className="text-xs text-slate-400 mt-1">Manage numbers and counters displayed in the statistics section</p>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8">
        {saved && (
          <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Statistics saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-6">
            {stats.map((stat, idx) => (
              <div key={stat.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center">
                    <DynamicIcon name={stat.icon || 'award'} className="w-5 h-5" />
                  </div>
                  <span className="text-xs text-slate-500 font-bold">Metric #{idx + 1}</span>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Value / Metric (e.g. 300+, 24/7)
                  </label>
                  <input
                    type="text"
                    value={stat.value}
                    onChange={(e) => handleChange(idx, 'value', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Label (e.g. Happy Clients, Repairs Done)
                  </label>
                  <input
                    type="text"
                    value={stat.label}
                    onChange={(e) => handleChange(idx, 'label', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                    required
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-lg shadow-red-600/25 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save All Statistics</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
