'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { HowItWorks } from '@/types';
import { Workflow, Save, Loader2, CheckCircle2 } from 'lucide-react';
import { DynamicIcon } from '@/components/ui/IconHelper';

export default function AdminHowItWorksPage() {
  const [steps, setSteps] = useState<HowItWorks[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    adminApi.getHowItWorks()
      .then((res) => {
        if (res.success && res.data) setSteps(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...steps];
    updated[index] = { ...updated[index], [field]: value };
    setSteps(updated);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);

    try {
      for (const step of steps) {
        await adminApi.updateHowItWorks(step.id, step);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      alert('Failed to save steps.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
        <p className="text-xs text-slate-500">Loading steps...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 border border-slate-800 rounded-3xl p-6">
        <div>
          <h1 className="text-2xl font-black text-white">How It Works (3 Steps)</h1>
          <p className="text-xs text-slate-400 mt-1">Configure the step-by-step customer service process</p>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8">
        {saved && (
          <div className="mb-6 p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Steps updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="space-y-6">
            {steps.map((step, idx) => (
              <div key={step.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center font-black text-xs">
                      0{step.step_number || idx + 1}
                    </div>
                    <span className="text-sm font-bold text-white">Step {step.step_number || idx + 1}</span>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Step Title *
                    </label>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) => handleChange(idx, 'title', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm font-bold text-white focus:outline-none focus:ring-1 focus:ring-red-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Icon Keyword
                    </label>
                    <select
                      value={step.icon || 'wrench'}
                      onChange={(e) => handleChange(idx, 'icon', e.target.value)}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                    >
                      <option value="calendar">calendar / book</option>
                      <option value="wrench">wrench / diagnostic</option>
                      <option value="check">check / delivery</option>
                      <option value="phone">phone</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Step Description *
                  </label>
                  <textarea
                    rows={2}
                    value={step.description}
                    onChange={(e) => handleChange(idx, 'description', e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white resize-none focus:outline-none focus:ring-1 focus:ring-red-500"
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
              <span>Save All Steps</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
