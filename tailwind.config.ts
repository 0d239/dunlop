import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
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
