import { Address, toNano } from "@ton/core"
import { GameManager } from "../wrappers/GameManager"
import { BruteforceLevelFactory } from "../wrappers/BruteforceLevelFactory"
import { NetworkProvider } from "@ton/blueprint"

export async function run(provider: NetworkProvider) {
  const gameManager = provider.open(
    await GameManager.fromAddress(
      Address.parse("EQBIdaDsXQ13Gbddcgi7Vl_9DfyB17sUkJylYqx-OqZWP50-"),
    ),
  )

  const bruteforceLevelFactory = provider.open(
    await BruteforceLevelFactory.fromInit(gameManager.address),
  )

  await bruteforceLevelFactory.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "Deploy",
      queryId: 0n,
    },
  )

  await provider.waitForDeploy(bruteforceLevelFactory.address)

  await gameManager.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "RegisterLevel",
      name: "bruteforce",
      factory: bruteforceLevelFactory.address,
    },
  )
}
