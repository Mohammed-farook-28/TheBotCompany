/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        neon: {
          blue: '#00baff',
        },
      },
      fontFamily: {
        sans: ['Pixelify Sans', 'Courier New', 'Monaco', 'Menlo', 'Ubuntu Mono', 'monospace'],
        pixel: ['Pixelify Sans', 'Courier New', 'Monaco', 'Menlo', 'Ubuntu Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
