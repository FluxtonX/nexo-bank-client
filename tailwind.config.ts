import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-plus-jakarta-sans)", "sans-serif"],
      },
      colors: {
        banking: {
          blue: "#0A3D91",
          navy: "#0A0F2C",
          gold: "#E8A020",
          green: "#22C55E",
          red: "#EF4444",
          offWhite: "#F4F6FA",
          border: "#E2E8F0",
          text: "#0A0F2C",
          muted: "#9CA3AF",
        },
        primary: {
          navy: "#0A0F2C",
          blue: "#1A3FBB",
        },
        accent: {
          gold: "#E8A020",
          green: "#22C55E",
          red: "#EF4444",
        },
        bg: {
          light: "#F4F6FA",
          white: "#FFFFFF",
        },
        text: {
          primary: "#0A0F2C",
          secondary: "#6B7280",
          muted: "#9CA3AF",
        },
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
