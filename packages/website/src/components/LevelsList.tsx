"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { sha256_sync } from "@ton/crypto"
import { LevelName, levels } from "@/constants/levels"
import { usePlayerStats } from "@/hooks/usePlayerStats"
import { useLangDictionary } from "@/hooks/useLangDictionary"

const LevelItem = ({
  name,
  isCompleted,
}: {
  name: LevelName
  isCompleted?: boolean
}) => {
  const langDictionary = useLangDictionary()
  const params = useParams()

  return (
    <Link
      href={`/${params.locale}/level/${name}`}
      className="flex justify-between p-3 border-b-2 last:border-b-0 border-black hover:bg-black hover:text-foreground transition"
    >
      <div className="col-span-5">{langDictionary.levels[name]}</div>
      <div>{isCompleted ? langDictionary.completed : ""}</div>
    </Link>
  )
}

export const LevelsList = () => {
  const playerStats = usePlayerStats()

  return (
    <div className="flex justify-center">
      <div className="flex flex-col flex-grow max-w-2xl text-xl border-black bg-foreground text-black box-content">
        {levels.map((levelName) => {
          const buffer = sha256_sync(levelName)
          const level = playerStats?.levels?.get(
            BigInt("0x" + buffer.toString("hex")),
          )
          return (
            <LevelItem
              key={levelName}
              name={levelName}
              isCompleted={level?.completed}
            />
          )
        })}
      </div>
    </div>
  )
}
