"use client"

import { useState } from "react"
import { Locale } from "@/i18n.config"
import { getLangDictionary } from "@/utils/lang-dictionary"
import { useLeaderboard } from "@/hooks/useLeaderboard"

export const AddPlayerInputGroup = ({ locale }: { locale: Locale }) => {
  const langDictionary = getLangDictionary(locale)
  const { sendAddPlayer } = useLeaderboard()

  const [playerName, setPlayerName] = useState("")

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-center items-center">
        {langDictionary.page.leaderboard.enterNickname}
      </div>
      <div className="flex items-center gap-4">
        <input
          value={playerName}
          onChange={(event) => setPlayerName(event.target.value)}
          className="w-full grow outline-none bg-backgroundLight text-white py-2 px-3 outline-offset-0 focus:outline focus:outline-backgroundDark"
          placeholder={langDictionary.page.leaderboard.nickname}
        />
        <button
          className="py-2 px-3 bg-foreground text-black hover:bg-black hover:text-foreground"
          onClick={() => sendAddPlayer(playerName)}
        >
          {langDictionary.submit}
        </button>
      </div>
    </div>
  )
}
