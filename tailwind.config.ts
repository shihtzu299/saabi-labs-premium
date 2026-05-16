import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#60a5fa",
        accent: "#8b5cf6",
        dark: "#050816"
      }
    }
  },
  plugins: []
};

export default config;