"use client"

import Link from "next/link"
import { getLangDictionary } from "@/utils/lang-dictionary"
import { Locale } from "@/i18n.config"
import { LeftArrow } from "@/components/assets/LeftArrow"
import { TypewriterText } from "@/components/TypewriterText"
import { useTonWallet } from "@tonconnect/ui-react"
import { useMemo } from "react"
import { levels } from "@/constants/levels"
import { usePlayerStats } from "@/hooks/usePlayerStats"
import { sha256_sync } from "@ton/crypto"

const BEGINNER_SBT_LEVELS_COUNT = 5
const ADVANCED_SBT_LEVELS_COUNT = 13
const EXPERT_SBT_LEVELS_COUNT = 21

export default function RewardsPage({
  params: { locale },
}: {
  params: { locale: Locale }
}) {
  const langDictionary = getLangDictionary(locale)
  const wallet = useTonWallet()
  const playerStats = usePlayerStats()

  const completedLevelsCount = useMemo(() => {
    return levels.filter((levelName) => {
      const buffer = sha256_sync(levelName)
      const level = playerStats?.levels?.get(
        BigInt("0x" + buffer.toString("hex")),
      )
      return level?.completed
    }).length
  }, [playerStats?.levels])

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
            className="flex justify-end items-center flex-grow p-4 border-b-2 border-foreground text-xl"
            text={langDictionary.rewards}
          />
        </div>
        <div className="p-6 md:p-12 h-full w-full flex flex-col gap-8">
          <div>{langDictionary.page.rewards.description}</div>
          <div className="grow flex flex-col justify-center">
            {!wallet && playerStats && (
              <div className="flex justify-center">
                {langDictionary.page.rewards.connectWallet}
              </div>
            )}
            {wallet && playerStats && (
              <div className="grid grid-cols-1 lg:grid-flow-col lg:grid-cols-3 lg:grid-rows-1 gap-2 text-base xl:text-lg">
                <div className="flex justify-between items-center p-3 w-full min-h-[94px] bg-backgroundLight gap-3 text-white border border-backgroundDark">
                  <div>BEGINNER SBT</div>
                  {completedLevelsCount >= BEGINNER_SBT_LEVELS_COUNT ? (
                    <button className="hover:bg-backgroundDark bg-foreground p-3 hover:text-foreground text-backgroundDark">
                      {langDictionary.page.rewards.claim}
                    </button>
                  ) : (
                    <div className="text-foreground">{`${completedLevelsCount} / ${BEGINNER_SBT_LEVELS_COUNT}`}</div>
                  )}
                </div>
                <div className="flex justify-between items-center p-3 w-full min-h-[94px] bg-backgroundLight gap-3 text-white border border-backgroundDark">
                  <div>ADVANCED SBT</div>
                  {completedLevelsCount >= ADVANCED_SBT_LEVELS_COUNT ? (
                    <button className="hover:bg-backgroundDark bg-foreground p-3 hover:text-foreground text-backgroundDark">
                      {langDictionary.page.rewards.claim}
                    </button>
                  ) : (
                    <div className="text-foreground">{`${completedLevelsCount} / ${ADVANCED_SBT_LEVELS_COUNT}`}</div>
                  )}
                </div>
                <div className="flex grow justify-between items-center p-3 w-full min-h-[94px] bg-backgroundLight gap-3 text-white border border-backgroundDark">
                  <div>EXPERT SBT</div>
                  {completedLevelsCount >= EXPERT_SBT_LEVELS_COUNT ? (
                    <button className="hover:bg-backgroundDark bg-foreground p-3 hover:text-foreground text-backgroundDark">
                      {langDictionary.page.rewards.claim}
                    </button>
                  ) : (
                    <div className="text-foreground">{`${completedLevelsCount} / ${EXPERT_SBT_LEVELS_COUNT}`}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
