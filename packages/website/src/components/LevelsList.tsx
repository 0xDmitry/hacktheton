"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { sha256_sync } from "@ton/crypto"
import { LevelName, levels } from "@/constants/levels"
import { usePlayerStats } from "@/hooks/usePlayerStats"
import { useLangDictionary } from "@/hooks/useLangDictionary"

const LevelItem = ({
  name,
  index,
  isCompleted,
}: {
  name: LevelName
  index: Number
  isCompleted?: boolean
}) => {
  const langDictionary = useLangDictionary()
  const params = useParams()

  return (
    <Link
      href={`/${params.locale}/level/${name}`}
      className="flex justify-between items-center p-3 border w-full bg-foreground gap-16 border-black hover:bg-black hover:text-foreground transition text-black text-lg"
    >
      <div>{`${index}.${langDictionary.levels[name]}`}</div>
      <div>{isCompleted ? langDictionary.completed : ""}</div>
    </Link>
  )
}

export const LevelsList = () => {
  const playerStats = usePlayerStats()

  return (
    <div className="grid grid-cols-1 lg:grid-flow-col lg:grid-cols-3 lg:grid-rows-7">
      {levels.map((levelName, index) => {
        const buffer = sha256_sync(levelName)
        const level = playerStats?.levels?.get(
          BigInt("0x" + buffer.toString("hex")),
        )
        return (
          <LevelItem
            key={levelName}
            name={levelName}
            index={index}
            isCompleted={level?.completed}
          />
        )
      })}
    </div>
  )
}
