"use client"

import Link from "next/link"
import { sha256_sync } from "@ton/crypto"
import { levels } from "@/constants/levels"
import { usePlayerStats } from "@/hooks/usePlayerStats"

const LevelItem = ({
  name,
  isCompleted,
}: {
  name: string
  isCompleted?: boolean
}) => (
  <Link
    href={`/level/${name}`}
    className="flex justify-between p-3 border-b-2 last:border-b-0 border-black hover:bg-black hover:text-foreground transition"
  >
    <div className="col-span-5">{name.replaceAll("-", " ").toUpperCase()}</div>
    <div className="">{isCompleted ? "COMPLETED" : ""}</div>
  </Link>
)

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
