"use client"

import { useEffect, useState } from "react"
import { highlightTactCode } from "@/utils/highlight-tact-code"
import tactCode from "./a.tact"

export const TactCode = () => {
  const [tactCodeHtml, setTactCodeHtml] = useState("")

  useEffect(() => {
    async function wait() {
      setTactCodeHtml(await highlightTactCode(tactCode))
    }
    wait()
  }, [])

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
