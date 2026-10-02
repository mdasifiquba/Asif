'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Phone, Mail, Clock, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 border-t border-slate-800">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          
          {/* Brand info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-black flex items-center justify-center border border-slate-800 shadow-lg shadow-black/40">
                <Image 
                  src="/netcet-logo.png" 
                  alt="NETCET" 
                  width={40} 
                  height={40} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                NET<span className="text-red-500">CET</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed">
              NETCET COMPUTERS - CCTV IT AND COMPUTER is Jamui&apos;s premier provider of IT hardware repairs, custom computing, CCTV surveillance, biometric security, and audio-visual setups.
            </p>
            <div className="pt-2 text-xs text-slate-500 font-medium">
              Trusted by 300+ satisfied clients across Jamui district.
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="text-slate-400 hover:text-red-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-slate-400 hover:text-red-400 transition-colors">
                  All Services &amp; Pricing
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-slate-400 hover:text-red-400 transition-colors">
                  About NETCET &amp; Founder
                </Link>
              </li>
              <li>
                <Link href="/coming-soon" className="text-slate-400 hover:text-red-400 transition-colors">
                  Upcoming Innovations
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-slate-400 hover:text-red-400 transition-colors">
                  Contact &amp; Enquiry
                </Link>
              </li>
            </ul>
          </div>

          {/* Our services */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Core Solutions
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/services/laptop-repair" className="text-slate-400 hover:text-red-400 transition-colors">
                  Laptop &amp; PC Repairs
                </Link>
              </li>
              <li>
                <Link href="/services/cctv-services" className="text-slate-400 hover:text-red-400 transition-colors">
                  CCTV Camera Installation
                </Link>
              </li>
              <li>
                <Link href="/services/biometric-services" className="text-slate-400 hover:text-red-400 transition-colors">
                  Biometric Attendance
                </Link>
              </li>
              <li>
                <Link href="/services/printer-services" className="text-slate-400 hover:text-red-400 transition-colors">
                  Printer &amp; Cartridge Refill
                </Link>
              </li>
              <li>
                <Link href="/services/pa-system-services" className="text-slate-400 hover:text-red-400 transition-colors">
                  PA &amp; Sound Systems
                </Link>
              </li>
            </ul>
          </div>

          {/* Store info & Jamui details */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-white mb-4">
              Jamui Center
            </h3>
            <div className="flex items-start gap-2.5 text-sm text-slate-400">
              <MapPin className="w-4 h-4 text-red-500 shrink-0 mt-1" />
              <div>
                <p>Near Luv Kush Gas Agency, Jamui Khaira Kawakol Rd, Jamui, Bihar - 811307</p>
                <a 
                  href="https://www.google.com/maps/place/NETCET+COMPUTERS+-+CCTV+IT+AND+COMPUTER,+luv+kush+gas+agency,+near,+Jamui+Khaira+Kawakol+Rd,+Jamui,+Bihar+811307/data=!4m2!3m1!1s0x899dbc934d196d2d:0x9ff4ff75a4af9869!18m1!1e1?utm_source=mstt_1&entry=gps&coh=192189&g_ep=CAESBzI2LjM3LjUYACDXggMqnwEsOTQyNjc3MjcsOTQyOTIxOTUsOTQyOTk1MzIsMTAwNzk2NDk4LDEwMDc5Nzc2MSwxMDA3OTU2MjUsOTQyODA1NzYsOTQyMDczOTQsOTQyMDc1MDYsOTQyMDg1MDYsOTQyMTg2NTMsOTQyMjk4MzksOTQyNzUxNjgsOTQyNzk2MTksMTAwODM1NzA0LDEwMDgyNTAyMSwxMDA4MjI0OTRCAklO&skid=b32864e2-db1e-43b0-8981-ae44038f98c1&g_st=ac"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-400 hover:text-red-300 text-xs font-semibold inline-block mt-1 underline"
                >
                  View on Google Maps &rarr;
                </a>
              </div>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-slate-400">
              <Phone className="w-4 h-4 text-red-500 shrink-0" />
              <a href="tel:+918210101223" className="hover:text-red-400 transition-colors">
                +91 821 010 1223
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-slate-400">
              <Mail className="w-4 h-4 text-red-500 shrink-0" />
              <a href="mailto:info@netcet.in" className="hover:text-red-400 transition-colors">
                info@netcet.in
              </a>
            </div>
            <div className="flex items-center gap-2.5 text-sm text-slate-400">
              <Clock className="w-4 h-4 text-red-500 shrink-0" />
              <span>Mon - Sat: 9:00 AM - 8:00 PM</span>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-slate-900 bg-black/40 py-6 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} NETCET COMPUTERS - CCTV IT AND COMPUTER. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link 
              href="/admin/login" 
              className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 transition-colors bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800"
            >
              <Lock className="w-3.5 h-3.5 text-red-500" />
              <span>Admin Portal</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
