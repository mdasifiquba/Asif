'use client';

import React, { useState } from 'react';
import { AnnouncementBar } from './AnnouncementBar';
import { Header } from './Header';
import { Footer } from './Footer';
import { BookingModal } from './BookingModal';
import { WhatsAppFloat } from './WhatsAppFloat';
import { ScrollToTop } from './ScrollToTop';
import { Service } from '@/types';

interface PublicLayoutProps {
  children: React.ReactNode;
}

export const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);

  const handleOpenBooking = (service?: Service) => {
    if (service) setSelectedService(service);
    else setSelectedService(null);
    setBookingModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <AnnouncementBar />
      <Header onOpenBooking={() => handleOpenBooking()} />
      <main className="flex-1">
        {/* Pass booking handler via clone or context if needed */}
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, {
              onOpenBooking: handleOpenBooking,
            });
          }
          return child;
        })}
      </main>
      <Footer />
      
      {/* Interactive Global Elements */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => {
          setBookingModalOpen(false);
          setSelectedService(null);
        }}
        selectedService={selectedService}
      />
      <WhatsAppFloat />
      <ScrollToTop />
    </div>
  );
};
