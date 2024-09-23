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
      borderRadius: {
        'lg': '12px',  // Custom rounding for buttons if needed
      },
      boxShadow: {
        'custom-button': '0px 4px 12px rgba(0, 0, 0, 0.3)', // Custom shadow for your button
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
        '.custom-button': {
          'width': '40px',
          'height': '40px', 
          'border-radius': '12px',  // custom rounded corners
          'box-shadow': '0px 4px 12px rgba(0, 0, 0, 0.3)',  // custom shadow
          'display': 'flex',
          'justify-content': 'center',
          'align-items': 'center',
          'transition': 'background-color 0.3s ease',
        },
        '.custom-button:hover': {
          'background-color': '#0c0c38', // change color on hover
        },
      };
      addUtilities(newUtilities, ['responsive', 'hover']);
    },
  ],
}
