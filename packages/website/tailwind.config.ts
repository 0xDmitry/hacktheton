import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cover: "var(--cover)",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      animation: {
        cursorBlink: "blink 1.1s step-end infinite 3.4s",
      },
      keyframes: {
        blink: {
          from: {
            opacity: "0",
          },
          "50%": {
            opacity: "1",
          },
          to: {
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [],
}
export default config
