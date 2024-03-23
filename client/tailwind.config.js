/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light_grey: '#5D6D7E',
        button_green: '#58D68D',
        background: '#34495E',
      },
    },
  },
  plugins: [],
}

