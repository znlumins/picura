import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          base: "#050505",
          surface: "#0A0A0A",
          card: "rgba(255, 255, 255, 0.04)",
          border: "rgba(255, 255, 255, 0.10)",
        },
        accent: {
          blue: "#3B82F6",
          emerald: "#10B981",
          rose: "#F43F5E",
          amber: "#F59E0B",
          slate: "#94A3B8",
        },
        brand: {
          primary: "#FFFFFF",
          dark: "#050505",
          violet: "#6366F1",
          violetHover: "#4F46E5",
          violetLight: "rgba(99, 102, 241, 0.15)",
          emerald: "#10B981",
          emeraldHover: "#059669",
          emeraldLight: "rgba(16, 185, 129, 0.15)",
          bgLight: "#050505",
          border: "rgba(255, 255, 255, 0.10)",
          muted: "#94A3B8",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        heading: ["Outfit", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      transitionTimingFunction: {
        glass: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
