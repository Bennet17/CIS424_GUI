/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    extend: {
      display: ["group-click"],
      colors: {
        'white': '#ffffff',
        'text-faded': '#999999',
        'nav-bg': '#e4e7e9',
        'border-color': '#374858',
        'main-color': '#607d97',
      },
    },
    extend: {
      backgroundColor: {
        "blue-350": "#79C0F1",
      },
    },
  },
  plugins: [],
};
