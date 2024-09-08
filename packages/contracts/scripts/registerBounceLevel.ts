import { Address, toNano } from "@ton/core"
import { GameManager } from "../wrappers/GameManager"
import { BounceLevelFactory } from "../wrappers/BounceLevelFactory"
import { NetworkProvider } from "@ton/blueprint"

export async function run(provider: NetworkProvider) {
  const gameManager = provider.open(
    await GameManager.fromAddress(
      Address.parse("EQBIdaDsXQ13Gbddcgi7Vl_9DfyB17sUkJylYqx-OqZWP50-"),
    ),
  )

  const bounceLevelFactory = provider.open(
    await BounceLevelFactory.fromInit(gameManager.address),
  )

  await bounceLevelFactory.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "Deploy",
      queryId: 0n,
    },
  )

  await provider.waitForDeploy(bounceLevelFactory.address)

  await gameManager.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "RegisterLevel",
      name: "bounce",
      factory: bounceLevelFactory.address,
    },
  )
}
