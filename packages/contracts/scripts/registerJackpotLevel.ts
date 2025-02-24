import { Address, toNano } from "@ton/core"
import { GameManager } from "../wrappers/GameManager"
import { JackpotLevelFactory } from "../wrappers/JackpotLevelFactory"
import { compile, NetworkProvider } from "@ton/blueprint"

export async function run(provider: NetworkProvider) {
  const gameManager = provider.open(
    await GameManager.fromAddress(
      Address.parse("EQBIdaDsXQ13Gbddcgi7Vl_9DfyB17sUkJylYqx-OqZWP50-"),
    ),
  )

  const jackpotLevelFactory = provider.open(
    await JackpotLevelFactory.fromInit(
      gameManager.address,
      await compile("JackpotLevel"),
    ),
  )

  await jackpotLevelFactory.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "Deploy",
      queryId: 0n,
    },
  )

  await provider.waitForDeploy(jackpotLevelFactory.address)

  await gameManager.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "RegisterLevel",
      name: "jackpot",
      factory: jackpotLevelFactory.address,
    },
  )
}
