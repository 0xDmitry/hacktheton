"use client"

import { useEffect, useRef, useState } from "react"
import { isMobile } from "react-device-detect"
import { Hook, Console, Decode, Unhook } from "console-feed"
import { Message } from "console-feed/lib/definitions/Component"
import { ArrowEnter } from "./assets/ArrowEnter"

export const CustomConsole = () => {
  const [logs, setLogs] = useState<Message[]>([])

  useEffect(() => {
    const hookedConsole = Hook(window.console, (log) => {
      setLogs((logs) => [...logs, Decode(log) as Message])
    })
    return () => {
      Unhook(hookedConsole)
    }
  }, [])

  const consoleRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const consoleElement = consoleRef?.current

    if (consoleElement) {
      consoleElement.scrollTo({
        top: consoleElement.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [logs])

  const processConsoleInput = (inputValue: string) => {
    console.log(inputValue)
    try {
      const result = Function("return " + inputValue)()
      console.log(result)
    } catch (error) {
      console.error(error)
    }
  }

  const handleKeydown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.code === "Enter") {
      const inputValue = event.currentTarget.value
      event.currentTarget.value = ""

      processConsoleInput(inputValue)
    }
  }

  const handleEnterButtonClick = () => {
    if (inputRef.current) {
      const inputValue = inputRef.current.value
      inputRef.current.value = ""

      processConsoleInput(inputValue)
    }
  }

  return (
    <div
      ref={consoleRef}
      className="w-full h-full overflow-y-scroll text-left bg-[#242424] leading-normal"
    >
      <Console logs={logs} variant="dark" />
      <div className="flex pl-[13px] py-2 w-full text-[#d5d5d5] text-[12px] font-courierNew items-center">
        <div>{">"}</div>
        <input
          ref={inputRef}
          onKeyDown={handleKeydown}
          className="w-full pl-[14px] bg-transparent border-none outline-none"
        />
        {isMobile && (
          <div className="px-3" onClick={handleEnterButtonClick}>
            <ArrowEnter />
          </div>
        )}
      </div>
    </div>
  )
}
