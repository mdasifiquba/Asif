'use client';

import React, { useState, useEffect } from 'react';
import { Service, ServiceCategory } from '@/types';
import { publicApi } from '@/lib/api';
import { ServiceCard } from './ServiceCard';
import { Search, Sparkles } from 'lucide-react';

interface ServiceGridProps {
  onBookService?: (service: Service) => void;
  limit?: number;
  title?: string;
  subtitle?: string;
  showFilters?: boolean;
}

const DEFAULT_SERVICES: Service[] = [
  {
    id: 1,
    category_id: 1,
    name: "Printer Services",
    slug: "printer-services",
    short_description: "Cartridge refilling, drum replacement, paper jam fixing, and complete printer support.",
    icon: "printer",
    price: "₹200",
    availability: "available",
    featured: 1,
    status: 1,
    sort_order: 1,
    category_name: "IT Services"
  },
  {
    id: 2,
    category_id: 1,
    name: "Laptop Services",
    slug: "laptop-services",
    short_description: "Screen replacement, battery replacement, keyboard repair, software installation & hardware repair.",
    icon: "laptop",
    price: "₹300",
    availability: "available",
    featured: 1,
    status: 1,
    sort_order: 2,
    category_name: "IT Services"
  },
  {
    id: 3,
    category_id: 1,
    name: "PC Services",
    slug: "pc-services",
    short_description: "Custom PC building, hardware upgrade, virus removal, Windows installation & troubleshooting.",
    icon: "laptop",
    price: "₹250",
    availability: "available",
    featured: 1,
    status: 1,
    sort_order: 3,
    category_name: "IT Services"
  },
  {
    id: 4,
    category_id: 2,
    name: "CCTV Services",
    slug: "cctv-services",
    short_description: "CCTV installation, DVR configuration, wiring, and mobile viewing setup.",
    icon: "camera",
    price: "₹1,500",
    availability: "available",
    featured: 1,
    status: 1,
    sort_order: 4,
    category_name: "Security Services"
  },
  {
    id: 5,
    category_id: 2,
    name: "Biometric Services",
    slug: "biometric-services",
    short_description: "Fingerprint attendance machine, face attendance, access control & attendance software.",
    icon: "fingerprint",
    price: "₹3,000",
    availability: "available",
    featured: 1,
    status: 1,
    sort_order: 5,
    category_name: "Security Services"
  },
  {
    id: 6,
    category_id: 2,
    name: "PA System Services",
    slug: "pa-system-services",
    short_description: "Public announcement, speaker installation, amplifier & school/office audio setup.",
    icon: "volume-2",
    price: "₹2,000",
    availability: "available",
    featured: 1,
    status: 1,
    sort_order: 6,
    category_name: "Security Services"
  }
];

const DEFAULT_CATEGORIES: ServiceCategory[] = [
  { id: 1, name: "IT Services", slug: "it-services", sort_order: 1, status: 1 },
  { id: 2, name: "Security Services", slug: "security-services", sort_order: 2, status: 1 }
];

export const ServiceGrid: React.FC<ServiceGridProps> = ({
  onBookService,
  limit,
  title = "Our Core IT & Security Services",
  subtitle = "Complete technology support, hardware repairs, and smart surveillance for homes, shops, and institutions in Jamui.",
  showFilters = true
}) => {
  const [services, setServices] = useState<Service[]>(DEFAULT_SERVICES);
  const [categories, setCategories] = useState<ServiceCategory[]>(DEFAULT_CATEGORIES);
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch live categories
    publicApi.getCategories()
      .then((catRes) => {
        if (catRes.success && catRes.data && catRes.data.length > 0) {
          setCategories(catRes.data);
        }
      })
      .catch(() => {});

    // Fetch live services
    publicApi.getServices()
      .then((servRes) => {
        if (servRes.success && servRes.data && servRes.data.length > 0) {
          setServices(servRes.data);
        }
      })
      .catch(() => {});
  }, []);

  const filteredServices = services.filter((s) => {
    const matchesCategory = selectedCategory === 'all' || s.category_id === selectedCategory;
    const matchesSearch = 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.short_description && s.short_description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const displayedServices = limit ? filteredServices.slice(0, limit) : filteredServices;

  return (
    <section id="services" className="py-20 bg-slate-950 text-white relative">
      {/* Background subtle radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-red-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Comprehensive Solutions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {title}
          </h2>
          <p className="text-slate-400 text-base sm:text-lg">
            {subtitle}
          </p>
        </div>

        {/* Category Filters & Search */}
        {showFilters && (
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
            {/* Category tabs */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                All Services ({services.length})
              </button>
              {categories.map((cat) => {
                const count = services.filter(s => s.category_id === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {cat.name} ({count})
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search services..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 rounded-xl border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder:text-slate-500"
              />
            </div>
          </div>
        )}

        {/* Services Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-slate-900/80 rounded-3xl p-6 border border-slate-800 animate-pulse space-y-4">
                <div className="w-12 h-12 bg-slate-800 rounded-2xl" />
                <div className="h-6 bg-slate-800 rounded-lg w-3/4" />
                <div className="h-4 bg-slate-800 rounded-lg w-1/3" />
                <div className="h-14 bg-slate-800/50 rounded-lg" />
                <div className="h-8 bg-slate-800 rounded-xl" />
              </div>
            ))}
          </div>
        ) : displayedServices.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/60 rounded-3xl border border-slate-800">
            <p className="text-slate-400 text-sm font-medium">No services found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {displayedServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onBook={onBookService}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
