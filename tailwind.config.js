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
        white: "#ffffff",
        "text-faded": "#999999",
        "nav-bg": "#e4e7e9",
        "border-color": "#374858",
        "main-color": "#607d97",
        "custom-primary": "#DD3846",
        "custom-primary-light": "#E8C7C6",
        "custom-secondary": "#3D3D3D",
        "custom-secondary-light": "#949494",
        "custom-accent": "#ACD4E0",
        "custom-accent-light": "#DEFFFD",
      },
      backgroundColor: {
        "blue-350": "#79C0F1",
      },
    },
  },
  plugins: [],
};
