import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kairos // Countdown Lock Screen Studio & Reverse Planner',
  description:
    'A precision reverse-engineering deadline planner and retina countdown lock screen generator. 100% Client-Side with Hybrid Cloud Sync.',
  keywords: [
    'countdown lock screen',
    'deadline planner',
    'lock screen wallpaper generator',
    'reverse schedule planner',
    'milestone tracker',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#09090b] text-[#f4f4f5] antialiased selection:bg-emerald-500/30 selection:text-emerald-200">
        <div className="fixed inset-0 bg-grain pointer-events-none z-50 opacity-40" />
        {children}
      </body>
    </html>
  );
}
