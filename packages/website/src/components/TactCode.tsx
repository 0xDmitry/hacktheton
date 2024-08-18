"use client"

import { useEffect, useState } from "react"
import { highlightTactCode } from "@/utils/highlight-tact-code"

export const TactCode = ({ code }: { code: string }) => {
  const [tactCodeHtml, setTactCodeHtml] = useState("")

  // TODO: Can ve load on server side?
  useEffect(() => {
    async function wait() {
      setTactCodeHtml(await highlightTactCode(code))
    }
    wait()
  }, [code])

  return (
    <div className="panelCode w-10/12">
      <div className="h-full overflow-scroll">
        <div
          className="dark"
          dangerouslySetInnerHTML={{ __html: tactCodeHtml }}
        />
      </div>
    </div>
  )
}
