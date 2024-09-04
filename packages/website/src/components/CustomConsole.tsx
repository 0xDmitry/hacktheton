"use client"

import { useEffect, useRef, useState } from "react"
import { Hook, Console, Decode, Unhook } from "console-feed"
import { isMobile as isMobileDevice } from "react-device-detect"
import { Message } from "console-feed/lib/definitions/Component"

export const CustomConsole = () => {
  const [logs, setLogs] = useState<Message[]>([])

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(isMobileDevice)
  }, [])

  useEffect(() => {
    const hookedConsole = Hook(window.console, (log) => {
      setLogs((logs) => [...logs, Decode(log) as Message])
    })
    return () => {
      Unhook(hookedConsole)
    }
  }, [])

  const consoleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const consoleElement = consoleRef?.current

    if (consoleElement) {
      consoleElement.scrollTo({
        top: consoleElement.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [logs])

  const handleKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Enter") {
      const inputValue = event.currentTarget.value
      event.currentTarget.value = ""

      console.log(inputValue)
      try {
        const result = Function("return " + inputValue)()
        console.log(result)
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <div
      ref={consoleRef}
      className="w-full h-full text-left bg-[#242424] leading-normal overflow-y-scroll border border-[#555555]"
    >
      <Console
        logs={logs}
        variant="dark"
        styles={{
          BASE_FONT_SIZE: `${isMobile ? "16px" : "14px"}`,
          BASE_FONT_FAMILY: "Courier New",
        }}
      />
      <div
        className={`${isMobile ? "text-base" : "text-sm"} flex pl-[13px] py-2 w-full text-[#d5d5d5] font-courierNew items-center`}
      >
        <div>{">"}</div>
        <input
          onKeyDown={handleKeydown}
          className="w-full pl-[14px] bg-transparent border-none outline-none"
        />
      </div>
    </div>
  )
}
