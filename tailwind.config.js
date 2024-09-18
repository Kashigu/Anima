/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'custom-dark': '#070720',
        'custom-blue-dark': '#0c0c38',
      },
      textStroke: {
        'sm': '0.5px',
        'DEFAULT': '1px',
        'lg': '2px',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const newUtilities = {
        '.text-stroke': {
          '-webkit-text-stroke': '1px black',
        },
        '.text-stroke-lg': {
          '-webkit-text-stroke': '2px black',
        },
        '.text-stroke-sm': {
          '-webkit-text-stroke': '0.5px black',
        },
        '.scrollbar-hide': {
          'scrollbar-width': 'none', /* Firefox */
          '-ms-overflow-style': 'none', /* Internet Explorer and Edge */
        },
        '.scrollbar-hide::-webkit-scrollbar': {
          'display': 'none', /* Safari and Chrome */
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
}
