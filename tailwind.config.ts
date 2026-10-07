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
        apple: {
          gray: "#f5f5f7",
          dark: "#1d1d1f",
          muted: "#86868b",
          subtle: "#e8e8ed",
          card: "#ffffff",
          blue: "#0071e3",
          hoverBlue: "#0077ed",
          whatsapp: "#25D366",
          whatsappDark: "#1ebd5b",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-poppins)",
          "-apple-system",
          "BlinkMacSystemFont",
          '"SF Pro Display"',
          '"SF Pro Text"',
          '"Helvetica Neue"',
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      boxShadow: {
        "apple-card": "0 4px 24px rgba(0, 0, 0, 0.04)",
        "apple-hover": "0 12px 32px rgba(0, 0, 0, 0.08)",
        "apple-modal": "0 24px 64px rgba(0, 0, 0, 0.16)",
      },
      borderRadius: {
        "apple-card": "1.5rem",
        "apple-pill": "9999px",
      },
    },
  },
  plugins: [],
};

export default config;
