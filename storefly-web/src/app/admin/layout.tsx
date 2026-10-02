'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Calendar, 
  MessageSquare, 
  Wrench, 
  Sliders, 
  Layers, 
  Award, 
  Workflow, 
  UserCheck, 
  Star, 
  Megaphone, 
  Rocket, 
  Image as ImageIcon, 
  Settings, 
  LogOut, 
  ExternalLink, 
  ShieldCheck, 
  Menu, 
  X,
  ChevronRight
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);

  // Exclude login page from admin sidebar wrapper
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    setIsClient(true);
    if (!isLoginPage) {
      const token = localStorage.getItem('storefly_admin_token');
      const userStr = localStorage.getItem('storefly_admin_user');
      if (!token) {
        router.push('/admin/login');
      } else if (userStr) {
        try {
          setAdminUser(JSON.parse(userStr));
        } catch {}
      }
    }
  }, [pathname, isLoginPage, router]);

  const handleLogout = () => {
    localStorage.removeItem('storefly_admin_token');
    localStorage.removeItem('storefly_admin_user');
    router.push('/admin/login');
  };

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isClient) {
    return null;
  }

  const menuSections = [
    {
      title: 'Operations',
      items: [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Service Bookings', href: '/admin/bookings', icon: Calendar },
        { name: 'Contact Enquiries', href: '/admin/messages', icon: MessageSquare },
      ]
    },
    {
      title: 'Catalog',
      items: [
        { name: 'Services & Rates', href: '/admin/services', icon: Wrench },
      ]
    },
    {
      title: 'Website Content',
      items: [
        { name: 'Hero Section', href: '/admin/hero', icon: Sliders },
        { name: 'Announcements', href: '/admin/announcements', icon: Megaphone },
        { name: 'Statistics', href: '/admin/statistics', icon: Layers },
        { name: 'Why Choose Us', href: '/admin/features', icon: Award },
        { name: 'How It Works', href: '/admin/how-it-works', icon: Workflow },
        { name: 'Founder Profile', href: '/admin/founder', icon: UserCheck },
        { name: 'Testimonials', href: '/admin/testimonials', icon: Star },
        { name: 'Coming Soon', href: '/admin/coming-soon', icon: Rocket },
      ]
    },
    {
      title: 'Assets & Config',
      items: [
        { name: 'Media Library', href: '/admin/media', icon: ImageIcon },
        { name: 'Site Settings', href: '/admin/settings', icon: Settings },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      
      {/* Mobile Header Bar */}
      <div className="md:hidden bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg overflow-hidden bg-black flex items-center justify-center border border-slate-800">
            <Image src="/netcet-logo.png" alt="NETCET" width={32} height={32} className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-white text-base">NETCET Admin</span>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-slate-400 hover:text-white rounded-lg"
        >
          {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar navigation */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-950 border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar Header */}
        <div>
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <Link href="/admin" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-black flex items-center justify-center border border-slate-800 shadow-md shadow-black/40">
                <Image src="/netcet-logo.png" alt="NETCET" width={40} height={40} className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="font-black text-lg text-white tracking-tight">
                  NET<span className="text-red-500">CET</span>
                </span>
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                  Admin Panel
                </span>
              </div>
            </Link>
          </div>

          {/* Nav items */}
          <div className="px-3 py-4 space-y-6 overflow-y-auto max-h-[calc(100vh-170px)]">
            {menuSections.map((section) => (
              <div key={section.title} className="space-y-1">
                <div className="px-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                  {section.title}
                </div>
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-red-600 text-white font-bold shadow-md shadow-red-600/25'
                          : 'text-slate-400 hover:text-white hover:bg-slate-900'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Footer with user info & logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 space-y-2">
          <div className="px-2 py-1 text-xs text-slate-400">
            <p className="font-bold text-white truncate">{adminUser?.name || 'Administrator'}</p>
            <p className="text-[10px] text-slate-500 truncate">{adminUser?.email || 'admin@storefly.in'}</p>
          </div>
          
          <div className="flex items-center gap-2 pt-1">
            <Link
              href="/"
              target="_blank"
              className="flex-1 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors border border-slate-800"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Visit Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 rounded-lg transition-colors border border-red-500/20"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin Content View */}
      <main className="flex-1 bg-slate-900 min-h-screen overflow-x-hidden flex flex-col">
        {/* Admin Topbar */}
        <header className="bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">NETCET Management Console</span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-md shadow-red-600/25 flex items-center gap-2 transition-all hover:scale-105"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Open Public Website</span>
            </Link>
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full flex-1">
          {children}
        </div>
      </main>

    </div>
  );
}
