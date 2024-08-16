"use client"

import { TypeAnimation } from "react-type-animation"

export const TypewriterText = ({ text }: { text: string }) => (
  <TypeAnimation
    cursor={false}
    className="whitespace-pre-line text-4xl text-center after:bg-foreground after:h-[1em] after:w-[0.65em] after:inline-block after:align-text-top after:content-[''] after:animate-cursorBlink"
    sequence={[text]}
    speed={20}
  />
)
