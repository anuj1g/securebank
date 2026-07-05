/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#1A56DB", hover: "#1E40AF", light: "#EFF6FF" },
        success: { DEFAULT: "#059669", light: "#D1FAE5" },
        ink: { DEFAULT: "#111827", muted: "#6B7280" },
        line: "#E5E7EB",
        surface: "#F9FAFB",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
