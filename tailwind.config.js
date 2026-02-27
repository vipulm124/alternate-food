/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#0e70ed', // Your custom HEX code
        'secondary': 'rgb(236, 72, 153)', // Your custom RGB code
        'custom-gray': { // You can even add shades
          100: '#495260',
          900: '#111827',
        },
    },
  },
},
  plugins: [],
}