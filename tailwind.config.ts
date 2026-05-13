import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}"],
  theme: {
    extend: {
      colors: {
        clementina: {
          50: "#f5f7f4",
          100: "#e8ede5",
          200: "#cfd9c9",
          300: "#aabea0",
          400: "#7e9c72",
          500: "#5a8050",
          600: "#446639",
          700: "#37522f",
          800: "#2e4a3a",
          900: "#1f2f1d",
        },
        cream: {
          50: "#fbf9f4",
          100: "#f5efe2",
          200: "#e8dfc8",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-fraunces)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
