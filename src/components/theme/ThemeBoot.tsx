'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/lib/state/useThemeStore';

/**
 * Reads the actual `dark` class set by the inline boot script in layout.tsx
 * and seeds the theme store so all subscribers (3D scene, components) start
 * coherent with the rendered DOM. No-op render.
 */
export default function ThemeBoot() {
  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    useThemeStore.setState({ theme: isDark ? 'dark' : 'light' });
  }, []);
  return null;
}
