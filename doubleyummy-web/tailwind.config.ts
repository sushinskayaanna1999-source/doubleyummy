import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B6B",
        primaryHover: "#FF5252",
        secondary: "#4ECDC4",
        background: "#FAFAFA",
        surface: "#FFFFFF",
        text: "#2D3436",
        textLight: "#636E72",
        border: "#E0E0E0",
        success: "#00B894",
        danger: "#FF7675"
      },
      borderRadius: {
        card: "16px",
        button: "12px",
        chip: "20px"
      },
      boxShadow: {
        card: "0 2px 8px rgba(0,0,0,0.08)",
        swipe: "0 4px 16px rgba(0,0,0,0.12)"
      },
      fontFamily: {
        sans: ["SF Pro Display", "-apple-system", "Inter", "sans-serif"]
      }
    }
  },
  plugins: []
} satisfies Config;
