"use client"

import { useState } from "react"
import { Locale } from "@/i18n.config"
import { getLangDictionary } from "@/utils/lang-dictionary"
import { useLeaderboard } from "@/hooks/useLeaderboard"

export const UpdatePlayerInputGroup = ({
  locale,
  onBackButtonClick,
}: {
  locale: Locale
  onBackButtonClick: () => void
}) => {
  const langDictionary = getLangDictionary(locale)
  const { sendUpdatePlayer } = useLeaderboard()

  const [playerName, setPlayerName] = useState("")

  return (
    <>
      <button
        className="h-10 px-3 text-xl bg-foreground text-black hover:bg-black hover:text-foreground"
        onClick={() => onBackButtonClick()}
      >
        {"<"}
      </button>
      <input
        value={playerName}
        onChange={(event) => setPlayerName(event.target.value)}
        className="sm:w-[300px] outline-none bg-backgroundLight text-white py-2 px-3 outline-offset-0 focus:outline focus:outline-backgroundDark"
        placeholder={langDictionary.page.leaderboard.newNickname}
      />
      <button
        onClick={() => sendUpdatePlayer(playerName)}
        className="py-2 px-3 bg-foreground text-black hover:bg-black hover:text-foreground"
      >
        {langDictionary.page.leaderboard.change}
      </button>
    </>
  )
}
