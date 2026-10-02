'use client';

import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';

interface WhatsAppFloatProps {
  phone?: string;
}

export const WhatsAppFloat: React.FC<WhatsAppFloatProps> = ({ phone = '918210101223' }) => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent('Hello NETCET! I need IT / Computer / CCTV services in Jamui.')}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
      {/* Call button */}
      <a
        href={`tel:+${cleanPhone}`}
        className="w-12 h-12 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-slate-800 transition-all hover:scale-110 active:scale-95 border border-slate-700 group"
        aria-label="Call NETCET"
      >
        <Phone className="w-5 h-5 text-red-400 group-hover:text-red-300" />
      </a>

      {/* WhatsApp Floating Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/30 transition-all hover:scale-110 active:scale-95 animate-pulse-subtle group relative"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-7 h-7 fill-white text-emerald-500" />
        <span className="absolute right-16 bg-slate-900 text-white text-xs font-bold py-1.5 px-3 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none">
          Chat with us on WhatsApp
        </span>
      </a>
    </div>
  );
};
