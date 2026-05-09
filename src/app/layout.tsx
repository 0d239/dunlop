import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dunlop — 3D Marketplace',
  description:
    "Dunlop. Since 1965. A diegetic 3D shopping experience for guitar accessories.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="h-full bg-[#0d0a08] text-[#f5f1ea]">{children}</body>
    </html>
  );
}
