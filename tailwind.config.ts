import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        obsidian: {
          950: "#050507",
          900: "#09090b",
          850: "#111115",
          800: "#18181b",
          700: "#27272a",
          600: "#3f3f46",
        },
        signal: {
          emerald: "#10b981",
          amber: "#f59e0b",
          rose: "#f43f5e",
          cyan: "#06b6d4",
          violet: "#8b5cf6",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "-apple-system", "sans-serif"],
        mono: ["var(--font-geist-mono)", "JetBrains Mono", "monospace"],
      },
      letterSpacing: {
        widestx2: "0.25em",
        widestx3: "0.4em",
      },
      animation: {
        "pulse-subtle": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "ticker-glow": "tickerGlow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        tickerGlow: {
          "0%": { opacity: "0.85" },
          "100%": { opacity: "1", filter: "drop-shadow(0 0 10px rgba(255,255,255,0.4))" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
