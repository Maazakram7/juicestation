/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette inspired by the JUICEeSTATION logo:
        // green (watermelon/kale), watermelon red, citrus orange.
        //
        // "*-deep" variants are darkened so they meet WCAG 2.1 AA
        // contrast (>=4.5:1) when used as TEXT on the cream/white bg.
        // Use the lighter values for fills, badges, and decoration.
        brand: {
          green: '#7DC242',         // primary — logo wordmark / fills
          'green-deep': '#4A8024',  // accessible green for text & hover
          melon: '#E94E4E',         // watermelon red — fills/badges only
          'melon-deep': '#C73A3A',  // accessible red for text/errors
          citrus: '#F39324',        // citrus orange — fills/badges only
          'citrus-deep': '#B36510', // accessible amber for text accents
          cream: '#FAF7F1',         // light bg
          charcoal: '#111111',      // dark bg
          ink: '#1B1B1B',           // dark card bg
        },
      },
      // Codified z-index scale so overlays never fight.
      zIndex: {
        nav: '50',
        toast: '60',
        'drawer-bg': '70',
        drawer: '80',
        skip: '100',
      },
      fontFamily: {
        // Oryzo-inspired typography: PP Neue Montreal everywhere.
        // Distinctive Lusion-favourite sans used across their award-winning sites.
        sans: ['"PP Neue Montreal"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"PP Neue Montreal"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-delayed': 'float 10s ease-in-out infinite 2s',
        'pulse-slow': 'pulse 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(3deg)' },
        },
      },
    },
  },
  plugins: [],
};
