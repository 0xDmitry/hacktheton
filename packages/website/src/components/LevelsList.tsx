"use client"

import Link from "next/link"
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
        {levels.map((levelName) => (
          <LevelItem
            key={levelName}
            name={levelName}
            isCompleted={
              (playerStats?.levels
                ?.values()
                .findIndex(
                  (level) => level.name === levelName && level.completed,
                ) ?? -1) >= 0
            }
          />
        ))}
      </div>
    </div>
  )
}
