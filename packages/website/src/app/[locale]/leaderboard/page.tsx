"use client"

import Link from "next/link"
import { useMemo, useState } from "react"
import { getLangDictionary } from "@/utils/lang-dictionary"
import { Locale } from "@/i18n.config"
import { LeftArrow } from "@/components/assets/LeftArrow"
import { TypewriterText } from "@/components/TypewriterText"
import { useTonWallet } from "@tonconnect/ui-react"
import { useTonConnect } from "@/hooks/useTonConnect"
import { useLeaderboard } from "@/hooks/useLeaderboard"
import { LeaderboardTable } from "@/components/LeaderboardTable"

export default function LeaderboardPage({
  params: { locale },
}: {
  params: { locale: Locale }
}) {
  const langDictionary = getLangDictionary(locale)
  const wallet = useTonWallet()
  const { sender } = useTonConnect()

  const { players, sendAddPlayer, sendUpdatePlayer } = useLeaderboard()

  const playerInList = useMemo(
    () =>
      sender.address &&
      players.values().find((player) => sender.address!.equals(player.address)),
    [players, sender.address],
  )

  const rankedPlayersList = useMemo(() => {
    return players
      .values()
      .sort(
        (a, b) =>
          Number(b.levelsCompleted - a.levelsCompleted) ||
          Number(a.order - b.order),
      )
      .map((player, index) => {
        return {
          rank: ++index,
          name: player.name,
          address: player.address.toString(),
          levels: Number(player.levelsCompleted),
        }
      })
  }, [players])

  const [playerName, setPlayerName] = useState("")
  const [newPlayerName, setNewPlayerName] = useState("")
  const [isNicknameChangeRequested, setIsNicknameChangeRequested] =
    useState<boolean>(false)

  return (
    <div className="flex justify-center w-full md:container md:mx-auto md:py-12 md:px-6">
      <div className="flex flex-col justify-center w-full border-2 border-foreground">
        <div className="flex">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-5 p-4 bg-foreground border-b-2 border-r-2 border-foreground text-black hover:bg-black hover:text-foreground [&_svg]:hover:fill-foreground transition text-xl"
          >
            <LeftArrow />
            <div>{langDictionary.back}</div>
          </Link>
          <TypewriterText
            className="flex justify-end items-center flex-grow p-4 border-b-2 border-foreground text-2xl sm:text-3xl"
            text={langDictionary.leaderboard}
          />
        </div>
        <div className="h-full w-full flex flex-col">
          <div className="flex justify-center items-center py-6 px-4 sm:px-6 lg:px-8 xl:px-20 mx-auto">
            {!wallet && (
              <div>{langDictionary.page.leaderboard.connectWallet}</div>
            )}
            {wallet && !playerInList && (
              <div className="flex flex-col gap-4">
                <div className="flex justify-center items-center">
                  {langDictionary.page.leaderboard.enterNickname}
                </div>
                <div className="flex items-center gap-4">
                  <input
                    value={playerName}
                    onChange={(event) => setPlayerName(event.target.value)}
                    className="w-full grow outline-none bg-backgroundLight text-white py-2 px-3 outline-offset-0 focus:outline focus:outline-backgroundDark"
                  />
                  <button
                    className="py-2 px-3 bg-foreground text-black hover:bg-black hover:text-foreground"
                    onClick={() => sendAddPlayer(playerName)}
                  >
                    {langDictionary.submit}
                  </button>
                </div>
              </div>
            )}
            {wallet && playerInList && (
              <div className="flex gap-4">
                {isNicknameChangeRequested ? (
                  <>
                    <button
                      className="h-10 px-3 text-xl bg-foreground text-black hover:bg-black hover:text-foreground"
                      onClick={() => setIsNicknameChangeRequested(false)}
                    >
                      {"<"}
                    </button>
                    <input
                      value={newPlayerName}
                      onChange={(event) => setNewPlayerName(event.target.value)}
                      className="sm:w-[300px] outline-none bg-backgroundLight text-white py-2 px-3 outline-offset-0 focus:outline focus:outline-backgroundDark"
                      placeholder={langDictionary.page.leaderboard.newNickname}
                    />
                    <button
                      onClick={() => sendUpdatePlayer(newPlayerName)}
                      className="py-2 px-3 bg-foreground text-black hover:bg-black hover:text-foreground"
                    >
                      {langDictionary.page.leaderboard.change}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => sendUpdatePlayer(playerInList.name)}
                      className="py-2 px-3 bg-foreground text-black hover:bg-black hover:text-foreground"
                    >
                      {langDictionary.page.leaderboard.updateData}
                    </button>
                    <button
                      className="py-2 px-3 bg-foreground text-black hover:bg-black hover:text-foreground"
                      onClick={() => setIsNicknameChangeRequested(true)}
                    >
                      {langDictionary.page.leaderboard.changeNickname}
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-20 mx-auto flex items-center grow">
            <LeaderboardTable playersList={rankedPlayersList} locale={locale} />
          </div>
        </div>
      </div>
    </div>
  )
}
