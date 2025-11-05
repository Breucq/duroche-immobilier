/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./{components,pages,services}/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            maxWidth: 'none',
          },
        },
      }),
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Lora', 'serif'],
      },
      colors: {
        'background': '#FDFCFB',
        'background-alt': '#F7F5F2',
        'primary-text': '#333D4B',
        'secondary-text': '#6B7A90',
        'accent': '#b68d3d',
        'accent-dark': '#b68d3d',
        'secondary': '#A5B4CB',
        'secondary-dark': '#8E9AAF',
        'border-color': '#E0E6ED',
        orange: {
          '500': '#f97316',
          '600': '#ea580c',
      }
    }
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}