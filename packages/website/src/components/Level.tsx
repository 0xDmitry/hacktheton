"use client"

import { useEffect } from "react"
import { Address } from "@ton/core"
import { ContractAdapter } from "@ton-api/ton-adapter"
import { levelsConfig, LevelName } from "@/constants/levels"
import { usePlayerStats } from "@/hooks/usePlayerStats"
import { useTonClientAdapter } from "@/hooks/useTonClientAdapter"
import { setupConsoleUtils } from "@/utils/console"

export const Level = ({
  name,
  code,
}: {
  name: LevelName
  code: React.ReactNode
}) => {
  const clientAdapter = useTonClientAdapter()
  const playerStats = usePlayerStats()

  const isCompleted =
    (playerStats?.levels
      ?.values()
      .findIndex((level) => level.name === name && level.completed) ?? -1) >= 0

  const levelInstance = playerStats?.levels
    ?.values()
    .find((level) => level.name === name)?.address

  useEffect(() => {
    setupConsoleUtils()
    console.log("Helper methods:")
    window.help()
  }, [])

  useEffect(() => {
    async function openContract(
      levelInstance: Address,
      clientAdapter: ContractAdapter,
    ) {
      window.contract = await levelsConfig[name].openLevelContract(
        levelInstance,
        clientAdapter,
      )
    }

    if (levelInstance && clientAdapter) {
      openContract(levelInstance, clientAdapter)
    } else {
      window.contract = undefined
    }
  }, [clientAdapter, levelInstance, name])

  return (
    <div className="p-6 md:p-12">
      <div className="text-md [&_*_a]:text-slate-400 [&_*_code]:text-slate-400">
        {isCompleted
          ? levelsConfig[name].completedDescription
          : levelsConfig[name].description}
      </div>
      {(levelsConfig[name].revealCode || isCompleted) && (
        <>
          <br />
          <div className="flex justify-center">{code}</div>
        </>
      )}
    </div>
  )
}