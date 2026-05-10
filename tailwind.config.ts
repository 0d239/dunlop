import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dunlop: {
          red: '#EF0000',
        },
      },
    },
  },
  plugins: [],
};

export default config;
