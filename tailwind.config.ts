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
        brand: {
          primary: "#0F172A",
          dark: "#1E293B",
          violet: "#6366F1",
          violetHover: "#4F46E5",
          violetLight: "#EEF2FF",
          emerald: "#10B981",
          emeraldHover: "#059669",
          emeraldLight: "#ECFDF5",
          bgLight: "#F8FAFC",
          border: "#E2E8F0",
          muted: "#64748B",
        },
      },
      fontFamily: {
        sans: ["Inter", "Plus Jakarta Sans", "sans-serif"],
        heading: ["Plus Jakarta Sans", "Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
