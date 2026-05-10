import type { Metadata } from 'next';
import './globals.css';
import { themeBootScript } from '@/lib/state/useThemeStore';
import ThemeBoot from '@/components/theme/ThemeBoot';

export const metadata: Metadata = {
  title: 'Dunlop',
  description:
    "Dunlop. Since 1965. A 3D marketplace for guitar accessories.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="h-full bg-white text-neutral-900 dark:bg-[#0d0a08] dark:text-[#f5f1ea]">
        <ThemeBoot />
        {children}
      </body>
    </html>
  );
}
