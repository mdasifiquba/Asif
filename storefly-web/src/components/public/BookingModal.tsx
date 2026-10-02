'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Service } from '@/types';
import { publicApi } from '@/lib/api';
import { 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  HelpCircle
} from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedService?: Service | null;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  selectedService,
}) => {
  const [services, setServices] = useState<Service[]>([]);
  const [formData, setFormData] = useState({
    service_id: selectedService?.id ? String(selectedService.id) : '',
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    address: '',
    city: 'Jamui',
    preferred_date: '',
    preferred_time: '10:00 AM - 01:00 PM',
    device_type: '',
    device_brand: '',
    issue_description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      publicApi.getServices().then((res) => {
        if (res.success && res.data) {
          setServices(res.data);
          if (selectedService?.id) {
            setFormData(prev => ({ ...prev, service_id: String(selectedService.id) }));
          } else if (res.data.length > 0 && !formData.service_id) {
            setFormData(prev => ({ ...prev, service_id: String(res.data[0].id) }));
          }
        }
      }).catch(() => {});
    }
  }, [isOpen, selectedService]);

  useEffect(() => {
    if (selectedService?.id) {
      setFormData(prev => ({ ...prev, service_id: String(selectedService.id) }));
    }
  }, [selectedService]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.customer_name.trim()) {
      setError('Please enter your full name.');
      return;
    }

    if (!formData.customer_phone.trim() || formData.customer_phone.trim().length < 10) {
      setError('Please enter a valid 10-digit phone number.');
      return;
    }

    if (!formData.service_id) {
      setError('Please select a service.');
      return;
    }

    if (!formData.address.trim()) {
      setError('Please provide your service/pickup address in Jamui.');
      return;
    }

    if (!formData.preferred_date) {
      setError('Please select a preferred date for the service.');
      return;
    }

    setLoading(true);

    try {
      const res = await publicApi.createBooking({
        ...formData,
        service_id: parseInt(formData.service_id),
      });

      if (res.success) {
        setSuccessData(res.data);
      } else {
        setError(res.message || 'Failed to submit booking. Please try again.');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'An error occurred while booking. Please try calling directly.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessData(null);
    setError('');
    setFormData({
      service_id: '',
      customer_name: '',
      customer_phone: '',
      customer_email: '',
      address: '',
      city: 'Jamui',
      preferred_date: '',
      preferred_time: '10:00 AM - 01:00 PM',
      device_type: '',
      device_brand: '',
      issue_description: '',
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleReset} title="Book an Expert IT / Security Service" maxWidth="max-w-2xl">
      {successData ? (
        <div className="text-center py-6 space-y-5">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-2xl font-black text-slate-900">Service Request Confirmed!</h3>
            <p className="text-slate-600 text-sm max-w-md mx-auto">
              Thank you, <span className="font-bold text-slate-900">{formData.customer_name}</span>. We have received your booking request for{' '}
              <span className="font-bold text-red-600">
                {services.find(s => String(s.id) === String(formData.service_id))?.name || 'IT Service'}
              </span>.
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-md mx-auto text-left text-xs space-y-2 text-slate-700">
            <div className="flex justify-between">
              <span className="text-slate-500">Scheduled Date:</span>
              <span className="font-bold">{formData.preferred_date} ({formData.preferred_time})</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Contact Number:</span>
              <span className="font-bold">{formData.customer_phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Location:</span>
              <span className="font-bold">{formData.address}, Jamui</span>
            </div>
          </div>

          <p className="text-xs text-slate-500">
            Our certified technician from NETCET will call you shortly to confirm the engineer visit.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={handleReset}
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition-colors"
            >
              Done &amp; Close
            </button>
            <a
              href={`https://wa.me/918210101223?text=${encodeURIComponent(`Hi NETCET! I just booked a service for ${formData.customer_name} (${formData.customer_phone}). Please confirm.`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 text-white text-xs font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
            >
              <span>Instant WhatsApp Update</span>
            </a>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Service Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Select Required Service *
            </label>
            <select
              value={formData.service_id}
              onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
              required
            >
              <option value="">-- Choose a Service --</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.category_name || 'Service'}) {s.price ? `- ${s.price}` : ''}
                </option>
              ))}
            </select>
          </div>

          {/* Name & Phone */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Your Full Name *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number (WhatsApp) *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  value={formData.customer_phone}
                  onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Service Address in Jamui *
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Shop / House No, Street, Landmark, Jamui"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                required
              />
            </div>
          </div>

          {/* Date & Preferred Time */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Preferred Date *
              </label>
              <input
                type="date"
                value={formData.preferred_date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setFormData({ ...formData, preferred_date: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Preferred Time Slot
              </label>
              <select
                value={formData.preferred_time}
                onChange={(e) => setFormData({ ...formData, preferred_time: e.target.value })}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white"
              >
                <option value="09:00 AM - 12:00 PM">Morning (09:00 AM - 12:00 PM)</option>
                <option value="12:00 PM - 03:00 PM">Afternoon (12:00 PM - 03:00 PM)</option>
                <option value="03:00 PM - 06:00 PM">Evening (03:00 PM - 06:00 PM)</option>
                <option value="06:00 PM - 08:00 PM">Late Evening (06:00 PM - 08:00 PM)</option>
              </select>
            </div>
          </div>

          {/* Device & Issue */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Issue or Requirement Details (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="E.g., Laptop display not turning on, or need 4 CCTV cameras installed at retail shop."
              value={formData.issue_description}
              onChange={(e) => setFormData({ ...formData, issue_description: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:bg-white resize-none"
            />
          </div>

          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/30 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4" />
                  <span>Confirm Service Booking</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
};
