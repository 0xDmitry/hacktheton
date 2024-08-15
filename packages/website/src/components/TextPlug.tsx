"use client"

import { TypeAnimation } from "react-type-animation"

export const TextPlug = () => (
  <TypeAnimation
    cursor={false}
    className="after:bg-foreground after:h-[31px] after:w-[20px] after:inline-block after:content-[''] after:animate-blink"
    style={{ whiteSpace: "pre-line" }}
    sequence={[`TON BASED WARGAME\nCOMING SOON`]}
    speed={20}
  />
)
