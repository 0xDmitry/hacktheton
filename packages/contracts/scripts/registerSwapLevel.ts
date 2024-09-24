import { Address, toNano } from "@ton/core"
import { GameManager } from "../wrappers/GameManager"
import { SwapLevelFactory } from "../wrappers/SwapLevelFactory"
import { NetworkProvider } from "@ton/blueprint"

export async function run(provider: NetworkProvider) {
  const gameManager = provider.open(
    await GameManager.fromAddress(
      Address.parse("EQBIdaDsXQ13Gbddcgi7Vl_9DfyB17sUkJylYqx-OqZWP50-"),
    ),
  )

  const swapLevelFactory = provider.open(
    await SwapLevelFactory.fromInit(gameManager.address),
  )

  await swapLevelFactory.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "Deploy",
      queryId: 0n,
    },
  )

  await provider.waitForDeploy(swapLevelFactory.address)

  await gameManager.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "RegisterLevel",
      name: "swap",
      factory: swapLevelFactory.address,
    },
  )
}
