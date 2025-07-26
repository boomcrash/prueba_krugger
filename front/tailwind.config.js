/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb', // azul para ingreso
        danger: '#ef4444',  // rojo para salir
        background: '#ffffff', // fondo blanco
        text: '#111111', // texto negro
      },
    },
  },
  plugins: [],
}
