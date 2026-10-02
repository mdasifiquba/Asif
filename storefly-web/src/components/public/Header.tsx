'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Menu, 
  X, 
  Calendar,
  ChevronRight
} from 'lucide-react';
import { publicApi } from '@/lib/api';

interface HeaderProps {
  onOpenBooking?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenBooking }) => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<Record<string, string>>({
    site_name: 'NETCET',
    site_tagline: 'NETCET COMPUTERS - CCTV IT AND COMPUTER',
    contact_phone: '+91 821 010 1223',
    contact_email: 'info@netcet.in',
    contact_address: 'Near Luv Kush Gas Agency, Jamui Khaira Kawakol Rd, Jamui, Bihar - 811307',
    working_hours: 'Mon - Sat: 9:00 AM - 8:00 PM'
  });

  useEffect(() => {
    publicApi.getSettings()
      .then((res) => {
        if (res.success && res.data) {
          setSettings(prev => ({ ...prev, ...res.data }));
        }
      })
      .catch(() => {});
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'About Us', href: '/about' },
    { name: 'Coming Soon', href: '/coming-soon' },
    { name: 'Contact', href: '/contact' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm transition-all">
      {/* Top info bar */}
      <div className="hidden lg:block bg-slate-900 text-slate-300 text-xs py-2 px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <a 
              href="https://www.google.com/maps/place/NETCET+COMPUTERS+-+CCTV+IT+AND+COMPUTER,+luv+kush+gas+agency,+near,+Jamui+Khaira+Kawakol+Rd,+Jamui,+Bihar+811307/data=!4m2!3m1!1s0x899dbc934d196d2d:0x9ff4ff75a4af9869!18m1!1e1?utm_source=mstt_1&entry=gps&coh=192189&g_ep=CAESBzI2LjM3LjUYACDXggMqnwEsOTQyNjc3MjcsOTQyOTIxOTUsOTQyOTk1MzIsMTAwNzk2NDk4LDEwMDc5Nzc2MSwxMDA3OTU2MjUsOTQyODA1NzYsOTQyMDczOTQsOTQyMDc1MDYsOTQyMDg1MDYsOTQyMTg2NTMsOTQyMjk4MzksOTQyNzUxNjgsOTQyNzk2MTksMTAwODM1NzA0LDEwMDgyNTAyMSwxMDA4MjI0OTRCAklO&skid=b32864e2-db1e-43b0-8981-ae44038f98c1&g_st=ac"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <MapPin className="w-3.5 h-3.5 text-red-500" />
              <span>{settings.contact_address || 'Near Luv Kush Gas Agency, Jamui Khaira Kawakol Rd, Jamui, Bihar - 811307'}</span>
            </a>
            <div className="flex items-center gap-1.5 hover:text-white transition-colors">
              <Clock className="w-3.5 h-3.5 text-red-500" />
              <span>{settings.working_hours || 'Mon - Sat: 9:00 AM - 8:00 PM'}</span>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <a 
              href={`tel:${settings.contact_phone || '+918210101223'}`} 
              className="flex items-center gap-1.5 text-slate-200 hover:text-red-400 font-medium transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-red-500" />
              <span>{settings.contact_phone || '+91 821 010 1223'}</span>
            </a>
            <a 
              href={`mailto:${settings.contact_email || 'info@netcet.in'}`} 
              className="flex items-center gap-1.5 text-slate-200 hover:text-red-400 font-medium transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-red-500" />
              <span>{settings.contact_email || 'info@netcet.in'}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-black flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-105 transition-transform duration-300 border border-slate-800">
              <Image 
                src="/netcet-logo.png" 
                alt="NETCET Logo" 
                width={44} 
                height={44} 
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-red-600 transition-colors">
                  NET<span className="text-red-600 group-hover:text-slate-900 transition-colors">CET</span>
                </span>
              </div>
              <span className="text-[9px] uppercase font-bold tracking-wider text-slate-500 block -mt-1 truncate max-w-[210px] sm:max-w-none">
                CCTV &amp; COMPUTER
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'text-red-600 bg-red-50 font-bold'
                      : 'text-slate-700 hover:text-red-600 hover:bg-slate-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href={`tel:${settings.contact_phone}`}
              className="px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all flex items-center gap-2 border border-slate-200"
            >
              <Phone className="w-4 h-4 text-red-600" />
              <span>Call Us</span>
            </a>
            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-sm font-bold rounded-xl shadow-md shadow-red-600/25 hover:shadow-lg hover:shadow-red-600/35 active:scale-95 transition-all flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Service</span>
            </button>
          </div>

          {/* Mobile menu toggle */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenBooking}
              className="p-2 bg-red-50 text-red-600 rounded-lg font-bold text-xs flex items-center gap-1 border border-red-200"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book</span>
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-red-600 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-base font-semibold flex items-center justify-between ${
                    isActive
                      ? 'bg-red-50 text-red-600 font-bold'
                      : 'text-slate-700 hover:bg-slate-50 hover:text-red-600'
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 opacity-40" />
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (onOpenBooking) onOpenBooking();
              }}
              className="w-full py-3 bg-red-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-red-600/20"
            >
              <Calendar className="w-4 h-4" />
              <span>Book a Service Now</span>
            </button>
            <a
              href={`tel:${settings.contact_phone}`}
              className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Phone className="w-4 h-4 text-red-600" />
              <span>Call: {settings.contact_phone}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
