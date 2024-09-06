"use client"

import { useEffect, useRef, useState } from "react"
import { isMobile as isMobileDevice } from "react-device-detect"
import { RingBuffer } from "ring-buffer-ts"
import { Hook, Console, Decode, Unhook } from "console-feed"
import { Message } from "console-feed/lib/definitions/Component"

export const CustomConsole = () => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(isMobileDevice)
  }, [])

  const [logs, setLogs] = useState<Message[]>([])

  useEffect(() => {
    const hookedConsole = Hook(window.console, (log) => {
      setLogs((logs) => [...logs, Decode(log) as Message])
    })
    return () => {
      Unhook(hookedConsole)
    }
  }, [])

  useEffect(() => {
    return () => {
      const commandsHistoryString = localStorage.getItem("commandsHistory")
      const commandsHistory = commandsHistoryString
        ? JSON.parse(commandsHistoryString)
        : []

      if (commandsHistory.length > 0) {
        localStorage.setItem("commandsOffset", "0")
      }
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

  const handleKeydown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    const inputValue = event.currentTarget.value

    if (event.code === "Enter" && inputValue !== "") {
      event.currentTarget.value = ""

      const commandsHistoryString = localStorage.getItem("commandsHistory")
      const commandsHistory = commandsHistoryString
        ? JSON.parse(commandsHistoryString)
        : []
      const ringBuffer = new RingBuffer<string>(200)
      ringBuffer.fromArray(commandsHistory)
      ringBuffer.add(inputValue)

      const newCommandsHistory = ringBuffer.toArray()
      localStorage.setItem(
        "commandsHistory",
        JSON.stringify(newCommandsHistory),
      )
      localStorage.setItem("commandsOffset", "0")

      console.log(inputValue)

      if (
        inputValue.trim().toLowerCase() === "clear()" ||
        inputValue.trim().toLowerCase() === "console.clear()"
      ) {
        setLogs([])
      } else {
        try {
          const AsyncFunction = async function () {}.constructor
          const result = await AsyncFunction("return " + inputValue)()
          console.log(result)
        } catch (error) {
          console.error(error)
        }
      }
    } else if (event.code === "ArrowDown" || event.code === "ArrowUp") {
      const commandsHistory = localStorage.getItem("commandsHistory")
      const commandsOffset = localStorage.getItem("commandsOffset")

      if (commandsOffset && commandsHistory) {
        const parsedCommandsHistory = JSON.parse(commandsHistory)
        const lastCommandIndex = parsedCommandsHistory.length - 1

        if (event.code === "ArrowUp") {
          const newCommandsOffset = Math.min(
            Number(commandsOffset) + 1,
            lastCommandIndex,
          )

          localStorage.setItem("commandsOffset", newCommandsOffset.toString())
          event.currentTarget.value =
            parsedCommandsHistory[lastCommandIndex - Number(commandsOffset)]

          setTimeout(() => {
            inputRef?.current?.setSelectionRange(
              inputRef?.current?.value.length,
              inputRef?.current?.value.length,
            )
          }, 0)
        } else {
          const newCommandsOffset = Math.max(Number(commandsOffset) - 1, 0)
          localStorage.setItem("commandsOffset", newCommandsOffset.toString())
          event.currentTarget.value =
            parsedCommandsHistory[lastCommandIndex - newCommandsOffset]
        }
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
          TABLE_DATA_BACKGROUND_IMAGE: "none",
        }}
      />
      <div
        className={`${isMobile ? "text-base" : "text-sm"} flex pl-[13px] py-2 w-full text-[#d5d5d5] font-courierNew items-center`}
      >
        <div>{">"}</div>
        <input
          ref={inputRef}
          onKeyDown={handleKeydown}
          className="w-full pl-[14px] bg-transparent border-none outline-none"
        />
      </div>
    </div>
  )
}
