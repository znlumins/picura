import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          white: "#ffffff",
          mist: "#f6f8fa",
          frost: "#eceff3",
        },
        border: {
          ash: "#cdd2d9",
          mist: "#c1c7d0",
        },
        ink: {
          fog: "#a4abb8",
          steel: "#818898",
          slate: "#666d80",
          graphite: "#36394a",
          midnight: "#272835",
          onyx: "#1a1b25",
        },
        violet: {
          volt: "#5e4cff",
          lavender: "#c8ccf3",
          lilac: "#dfdbff",
        },
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "sans-serif"],
        heading: ["'Space Grotesk'", "Inter", "-apple-system", "sans-serif"],
        mono: ["'IBM Plex Mono'", "JetBrains Mono", "monospace"],
      },
      borderRadius: {
        card: "12px",
        btn: "8px",
      },
      boxShadow: {
        subtle: "rgba(39, 40, 53, 0.08) 0px 12px 12px -6px, rgba(39, 40, 53, 0.1) 0px 0px 0px 1px",
        preview: "rgba(0, 0, 0, 0.05) 0px 2px 5px 0px, rgba(0, 0, 0, 0.04) 0px 9px 9px 0px, rgba(39, 40, 53, 0.08) 0px 24px 24px -12px",
        card: "rgba(39, 40, 53, 0.05) 0px 0px 0px 1px",
      },
      letterSpacing: {
        tighter: "-0.025em",
        tight: "-0.015em",
      },
    },
  },
  plugins: [],
};
export default config;
