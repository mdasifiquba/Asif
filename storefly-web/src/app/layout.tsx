import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NETCET — NETCET COMPUTERS - CCTV IT AND COMPUTER | Jamui, Bihar',
  description: 'NETCET COMPUTERS - CCTV IT AND COMPUTER. Jamui\'s premier destination for Laptop & PC repairs, CCTV camera installation, Biometric attendance systems, PA systems, and IT network maintenance.',
  keywords: 'NETCET, NETCET COMPUTERS, CCTV IT AND COMPUTER, CCTV installation Jamui, laptop repair Jamui, computer service Bihar, biometric attendance Jamui, IT solutions',
  icons: {
    icon: '/netcet-logo.png',
    shortcut: '/netcet-logo.png',
    apple: '/netcet-logo.png',
  },
  openGraph: {
    title: 'NETCET — NETCET COMPUTERS - CCTV IT AND COMPUTER in Jamui',
    description: 'Expert Computer & Laptop Repair, CCTV Surveillance & Biometric Solutions in Jamui, Bihar.',
    url: 'https://netcet.in',
    siteName: 'NETCET',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen flex flex-col bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
