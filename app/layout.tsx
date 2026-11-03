import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'BMKG Early Warning System - Monitoring Seismik & Tsunami Indonesia',
  description:
    'Sistem Peringatan Dini Gempa Bumi & Tsunami Real-Time terintegrasi data resmi BMKG dan Supabase.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossOrigin=""
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-[#0b1120] text-slate-100">
        {children}
      </body>
    </html>
  );
}
