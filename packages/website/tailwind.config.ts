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
        typewriter: "typewriter 2s steps(30) forwards",
        caret: "typewriter 2s steps(30) forwards, blink 1s infinite 2s",
      },
      keyframes: {
        typewriter: {
          to: {
            left: "100%",
          },
        },
        blink: {
          "0%": {
            opacity: "0",
          },
        },
      },
    },
  },
  plugins: [],
}
export default config
