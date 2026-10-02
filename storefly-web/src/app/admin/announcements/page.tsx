'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { Announcement } from '@/types';
import { Plus, Edit, Trash2, Megaphone, Loader2, Save, CheckCircle2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Announcement | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    badge_text: '',
    link_url: '',
    link_text: '',
    type: 'info',
    status: 1
  });

  const [saving, setSaving] = useState(false);

  const fetchData = () => {
    setLoading(true);
    adminApi.getAnnouncements()
      .then((res) => {
        if (res.success && res.data) setAnnouncements(res.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setEditingItem(null);
    setFormData({
      title: 'Special Offer',
      message: '',
      badge_text: 'NEW OFFER',
      link_url: '/services',
      link_text: 'Book Now',
      type: 'info',
      status: 1
    });
    setModalOpen(true);
  };

  const openEdit = (item: Announcement) => {
    setEditingItem(item);
    setFormData({
      title: item.title || '',
      message: item.message || '',
      badge_text: item.badge_text || '',
      link_url: item.link_url || '',
      link_text: item.link_text || '',
      type: item.type || 'info',
      status: item.status
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingItem) {
        await adminApi.updateAnnouncement(editingItem.id, formData);
      } else {
        await adminApi.createAnnouncement(formData);
      }
      fetchData();
      setModalOpen(false);
    } catch {
      alert('Failed to save announcement.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await adminApi.deleteAnnouncement(id);
      setAnnouncements(announcements.filter(a => a.id !== id));
    } catch {
      alert('Failed to delete announcement.');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 border border-slate-800 rounded-3xl p-6">
        <div>
          <h1 className="text-2xl font-black text-white">Top Announcement Bar</h1>
          <p className="text-xs text-slate-400 mt-1">Manage scrolling alerts, special offers, and holiday announcements</p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-md shadow-red-600/25 flex items-center gap-2 transition-all self-start"
        >
          <Plus className="w-4 h-4" />
          <span>New Announcement</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
          <p className="text-xs text-slate-500">Loading announcements...</p>
        </div>
      ) : announcements.length === 0 ? (
        <div className="py-16 text-center bg-slate-950 border border-slate-800 rounded-2xl">
          <p className="text-xs text-slate-400">No announcements found. Create one above.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {announcements.map((item) => (
            <div
              key={item.id}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{item.title}</span>
                  {item.badge_text && (
                    <span className="text-[10px] bg-red-600/20 text-red-400 px-2 py-0.5 rounded-full font-bold border border-red-500/30">
                      {item.badge_text}
                    </span>
                  )}
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${item.status ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                    {item.status ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{item.message}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => openEdit(item)}
                  className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors border border-slate-800"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <Modal
          isOpen={true}
          onClose={() => setModalOpen(false)}
          title={editingItem ? 'Edit Announcement' : 'New Announcement'}
        >
          <form onSubmit={handleSave} className="space-y-4 text-slate-800">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Message *</label>
              <textarea
                rows={2}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Badge Text (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. SPECIAL OFFER"
                  value={formData.badge_text}
                  onChange={(e) => setFormData({ ...formData, badge_text: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Link URL</label>
                <input
                  type="text"
                  placeholder="e.g. /services"
                  value={formData.link_url}
                  onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.status === 1}
                  onChange={(e) => setFormData({ ...formData, status: e.target.checked ? 1 : 0 })}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <span>Active &amp; Displayed on Site</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/20 flex items-center gap-2 disabled:opacity-50"
              >
                {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
