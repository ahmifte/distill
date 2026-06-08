import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#7c3aed",
          fg: "#ffffff",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      container: {
        center: true,
        padding: "1.5rem",
        screens: { "2xl": "1100px" },
      },
    },
  },
  plugins: [],
};

export default config;
