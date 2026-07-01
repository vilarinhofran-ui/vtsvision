import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        vtsBlue: "#009DFF",
        vtsDarkBlue: "#003C8F",
      },
      boxShadow: {
        soft: "0 10px 40px rgba(0, 60, 143, 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
