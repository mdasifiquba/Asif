'use client';

import React, { useEffect, useState } from 'react';
import { Announcement } from '@/types';
import { publicApi } from '@/lib/api';
import { Megaphone, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const AnnouncementBar: React.FC = () => {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    publicApi.getAnnouncements()
      .then((res) => {
        if (res.success && res.data && res.data.length > 0) {
          setAnnouncement(res.data[0]);
        }
      })
      .catch(() => {
        // Fallback default announcement
        setAnnouncement({
          id: 1,
          title: 'Special Offer',
          message: 'Get 20% OFF on all CCTV installations and laptop servicing this month in Jamui!',
          badge_text: 'NEW OFFER',
          link_url: '/services',
          link_text: 'Book Now',
          type: 'info',
          status: 1
        });
      });
  }, []);

  if (!announcement || dismissed) return null;

  return (
    <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white text-xs sm:text-sm py-2 px-4 relative z-40 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden flex-1 justify-center sm:justify-start">
          {announcement.badge_text && (
            <span className="bg-white/20 text-white uppercase text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider shrink-0 border border-white/30">
              {announcement.badge_text}
            </span>
          )}
          <span className="truncate font-medium">
            {announcement.message}
          </span>
          {announcement.link_url && (
            <Link 
              href={announcement.link_url} 
              className="inline-flex items-center gap-1 font-bold underline underline-offset-2 hover:text-red-100 shrink-0 ml-1"
            >
              {announcement.link_text || 'Learn more'}
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 hover:bg-white/20 rounded-md transition-colors shrink-0 text-white/80 hover:text-white"
          aria-label="Dismiss announcement"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
