"use client"

import Link from "next/link"
import { useMemo } from "react"
import { getLangDictionary } from "@/utils/lang-dictionary"
import { Locale } from "@/i18n.config"
import { LeftArrow } from "@/components/assets/LeftArrow"
import { TypewriterText } from "@/components/TypewriterText"
import { useTonWallet } from "@tonconnect/ui-react"
import { playersMock } from "@/playersMock"
import { useTonConnect } from "@/hooks/useTonConnect"
import { LeaderboardTable } from "@/components/LeaderboardTable"

export default function LeaderboardPage({
  params: { locale },
}: {
  params: { locale: Locale }
}) {
  const langDictionary = getLangDictionary(locale)
  const wallet = useTonWallet()
  const { sender } = useTonConnect()

  const playerAddress = useMemo(
    () => sender.address?.toString(),
    [sender.address],
  )

  const isPlayerInList = useMemo(
    () =>
      Boolean(playerAddress) &&
      playersMock.some((player) => player.address === playerAddress),
    [playerAddress],
  )

  const rankedPlayersList = useMemo(() => {
    const sortedList = playersMock.sort((a, b) => b.levels - a.levels)

    let rank = 1

    return sortedList.map((player, index, array) => {
      const result = {
        rank,
        name: player.name,
        levels: player.levels,
      }

      if (index < array.length - 1 && player.levels > array[index + 1].levels) {
        rank++
      }

      return result
    })
  }, [])

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
            className="flex justify-end items-center flex-grow p-4 border-b-2 border-foreground text-3xl"
            text={"LEADERBOARD"}
          />
        </div>
        <div className="h-full w-full">
          <div className="flex justify-center items-center py-6 px-4 sm:px-6 lg:px-8 xl:px-20 mx-auto">
            {!wallet && (
              <div>Connect the wallet in order to update your results</div>
            )}
            {wallet && !isPlayerInList && (
              <div className="flex flex-col gap-4">
                <div className="flex justify-center items-center">
                  Enter your nickname to be displayed in the table
                </div>
                <div className="flex items-center gap-4">
                  <input className="w-full grow outline-none bg-backgroundLight text-white py-2 px-3 outline-offset-0 focus:outline focus:outline-backgroundDark" />
                  <button className="py-2 px-3 bg-foreground text-black hover:bg-black hover:text-foreground">
                    SUBMIT
                  </button>
                </div>
              </div>
            )}
            {wallet && isPlayerInList && (
              <button className="p-3 bg-foreground text-black hover:bg-black hover:text-foreground">
                UPDATE LEADERBOARD DATA
              </button>
            )}
          </div>

          <div className="px-4 sm:px-6 lg:px-8 xl:px-20 mx-auto">
            <LeaderboardTable playersList={rankedPlayersList} locale={locale} />
          </div>
        </div>
      </div>
    </div>
  )
}
