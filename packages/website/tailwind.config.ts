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
        typewriter: "growRight 2s steps(25) forwards",
        cursor:
          "growRight 2s steps(25) forwards, blink 1s step-end infinite 2.2s",
      },
      keyframes: {
        growRight: {
          to: {
            left: "100%",
          },
        },
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
