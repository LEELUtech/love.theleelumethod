/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      screens: {
        '2xl': '1200px',
      },
    },
    extend: {
      colors: {
        brand: {
          deep: '#3C0606',
          primary: '#B02F44',
          blush: '#F2E1E2',
          white: '#FFFFFF',
          black: '#000000',
        },
      },
      fontSize: {
        h1: ['60px', { lineHeight: '1.1', fontWeight: '600' }],
        h2: ['32px', { lineHeight: '1.2', fontWeight: '600' }],
        body: ['17px', { lineHeight: '1.6' }],
        cta: ['15px', { lineHeight: '1.6', letterSpacing: '0.01em' }],
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        lato: ['var(--font-lato)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
        figtree: ['var(--font-figtree)', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'serif'],
        canela: ['var(--font-canela)', 'serif'],
        display: ['var(--font-canela)', 'var(--font-playfair)', 'serif'],
      },
    },
  },
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('tailwindcss-animate'),
  ],
};
