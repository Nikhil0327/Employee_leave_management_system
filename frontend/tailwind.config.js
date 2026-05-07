/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0f172a",
        clay: "#f3e8e0",
        ember: "#ff6b35",
        tide: "#1b4332",
        mist: "#e2e8f0",
      },
      boxShadow: {
        glow: "0 10px 40px rgba(255, 107, 53, 0.25)",
        soft: "0 12px 30px rgba(15, 23, 42, 0.12)",
      },
    },
  },
  plugins: [],
};
