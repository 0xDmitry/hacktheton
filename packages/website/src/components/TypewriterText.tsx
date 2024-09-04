"use client"

import { TypeAnimation } from "react-type-animation"

export const TypewriterText = ({
  text,
  className,
}: {
  text: string
  className?: string
}) => (
  <TypeAnimation
    cursor={false}
    className={`${className} whitespace-pre-line after:bg-foreground after:h-[1em] after:w-[0.65em] after:inline-block after:align-text-top after:content-[''] after:animate-cursorBlink`}
    sequence={[text]}
    speed={20}
  />
)
