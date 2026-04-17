/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Brand palette inspired by the JUICEeSTATION logo:
        // green (watermelon/kale), watermelon red, citrus orange
        brand: {
          green: '#7DC242',        // primary — from logo wordmark
          'green-deep': '#5A9A2E', // darker green for hover/active
          melon: '#E94E4E',        // watermelon red accent
          citrus: '#F39324',       // orange accent
          cream: '#FAF7F1',        // light bg
          charcoal: '#111111',     // dark bg
          ink: '#1B1B1B',          // dark card bg
        },
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
