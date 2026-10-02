'use client';

import React, { useEffect, useState } from 'react';
import { adminApi } from '@/lib/api';
import { Booking } from '@/types';
import { 
  Calendar, 
  Search, 
  Trash2, 
  Edit, 
  CheckCircle, 
  Clock, 
  Phone, 
  MapPin, 
  FileText, 
  Loader2,
  RefreshCw,
  XCircle,
  Eye
} from 'lucide-react';
import { formatDate, formatDateTime } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');
  
  // Selected booking for detail/status update
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [newStatus, setNewStatus] = useState<string>('confirmed');
  const [notes, setNotes] = useState<string>('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBookings = () => {
    setLoading(true);
    adminApi.getBookings()
      .then((res) => {
        if (res.success && res.data) {
          setBookings(res.data);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    setActionLoading(true);

    try {
      const res = await adminApi.updateBookingStatus(selectedBooking.id, newStatus, notes);
      if (res.success) {
        fetchBookings();
        setSelectedBooking(null);
      }
    } catch {
      alert('Failed to update booking status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this booking record?')) return;
    try {
      const res = await adminApi.deleteBooking(id);
      if (res.success) {
        setBookings(bookings.filter(b => b.id !== id));
      }
    } catch {
      alert('Failed to delete booking.');
    }
  };

  const filtered = bookings.filter((b) => {
    const matchesStatus = filterStatus === 'all' || b.status === filterStatus;
    const name = (b.customer_name || (b as any).name || '').toLowerCase();
    const phone = (b.customer_phone || (b as any).phone || '');
    const serviceName = (b.service_name || '').toLowerCase();
    const searchLower = (search || '').toLowerCase();

    const matchesSearch = 
      name.includes(searchLower) ||
      phone.includes(searchLower) ||
      serviceName.includes(searchLower);

    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950 border border-slate-800 rounded-3xl p-6">
        <div>
          <h1 className="text-2xl font-black text-white">Customer Service Bookings</h1>
          <p className="text-xs text-slate-400 mt-1">Manage technician assignments, dates, and service statuses in Jamui</p>
        </div>
        <button
          onClick={fetchBookings}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors border border-slate-700 self-start"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-950 border border-slate-800 rounded-2xl p-4">
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'confirmed', 'in_progress', 'completed', 'cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                filterStatus === st
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by customer, phone..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>
      </div>

      {/* Bookings Table / List */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
          <p className="text-xs text-slate-500">Loading bookings...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-16 text-center bg-slate-950 border border-slate-800 rounded-2xl">
          <p className="text-xs text-slate-400">No bookings found matching current filters.</p>
        </div>
      ) : (
        <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Date &amp; Time</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-slate-500">#{b.id}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-white text-sm">{b.customer_name || (b as any).name || 'Customer'}</div>
                      <div className="text-slate-400 font-mono text-[11px]">{b.customer_phone || (b as any).phone || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-semibold text-red-400">{b.service_name || 'Service'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-200 font-medium">{formatDate(b.preferred_date)}</div>
                      <div className="text-[10px] text-slate-500">{b.preferred_time || 'General'}</div>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-slate-400">
                      {b.address}, {b.city || 'Jamui'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        b.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        b.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        b.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                        b.status === 'completed' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' :
                        'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {b.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedBooking(b);
                            setNewStatus(b.status);
                            setNotes(b.notes || (b as any).admin_note || '');
                          }}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                          title="View / Update Booking"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Booking Status & Details Modal */}
      {selectedBooking && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedBooking(null)}
          title={`Booking Details #${selectedBooking.id}`}
        >
          <div className="space-y-6 text-slate-800">
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block font-medium">Customer:</span>
                <span className="font-bold text-slate-900 text-sm">{selectedBooking.customer_name || (selectedBooking as any).name || 'Customer'}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Phone:</span>
                <a href={`tel:${selectedBooking.customer_phone || (selectedBooking as any).phone}`} className="font-bold text-red-600">
                  {selectedBooking.customer_phone || (selectedBooking as any).phone || '-'}
                </a>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Service:</span>
                <span className="font-bold text-slate-900">{selectedBooking.service_name || 'Service'}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Scheduled Date:</span>
                <span className="font-bold text-slate-900">{formatDate(selectedBooking.preferred_date)} ({selectedBooking.preferred_time})</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-500 block font-medium">Address:</span>
                <span className="font-semibold text-slate-900">{selectedBooking.address}, {selectedBooking.city || 'Jamui'}</span>
              </div>
              {selectedBooking.issue_description && (
                <div className="col-span-2">
                  <span className="text-slate-500 block font-medium">Issue / Description:</span>
                  <p className="text-slate-700 bg-white p-2.5 rounded-lg border border-slate-200 mt-1">
                    {selectedBooking.issue_description}
                  </p>
                </div>
              )}
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Change Booking Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Technician / Internal Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g. Engineer Ramesh assigned. Parts replaced: SSD 512GB."
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedBooking(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/20 disabled:opacity-50 flex items-center gap-2"
                >
                  {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                  <span>Save Status</span>
                </button>
              </div>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
}
