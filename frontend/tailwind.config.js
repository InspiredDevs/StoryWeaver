/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          teal: {
            400: '#2DD4BF',
            500: '#14B8A6',
            800: '#0F766E',
          },
        },
      },
    },
    plugins: [],
  }