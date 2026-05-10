import { create } from 'zustand';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'dunlop:theme';

type ThemeStore = {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
};

function applyToDom(theme: Theme) {
  if (typeof document === 'undefined') return;
  document.documentElement.classList.toggle('dark', theme === 'dark');
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* sandboxed / private mode */
  }
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
  theme: 'light',
  setTheme: (theme) => {
    applyToDom(theme);
    set({ theme });
  },
  toggle: () => {
    const next: Theme = get().theme === 'dark' ? 'light' : 'dark';
    applyToDom(next);
    set({ theme: next });
  },
}));

/**
 * Inline boot script — runs before React hydrates to avoid FOUC.
 * Embedded into <head> via dangerouslySetInnerHTML.
 */
export const themeBootScript = `(function(){try{var s=localStorage.getItem('${STORAGE_KEY}');var t=s==='dark'?'dark':'light';if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`;
