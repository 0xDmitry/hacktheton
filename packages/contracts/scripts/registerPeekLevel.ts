import { Address, toNano } from "@ton/core"
import { GameManager } from "../wrappers/GameManager"
import { PeekLevelFactory } from "../wrappers/PeekLevelFactory"
import { NetworkProvider } from "@ton/blueprint"

export async function run(provider: NetworkProvider) {
  const gameManager = provider.open(
    await GameManager.fromAddress(
      Address.parse("EQBIdaDsXQ13Gbddcgi7Vl_9DfyB17sUkJylYqx-OqZWP50-"),
    ),
  )

  const peekLevelFactory = provider.open(
    await PeekLevelFactory.fromInit(gameManager.address, 1337n),
  )

  await peekLevelFactory.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "Deploy",
      queryId: 0n,
    },
  )

  await provider.waitForDeploy(peekLevelFactory.address)

  await gameManager.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "RegisterLevel",
      name: "peek",
      factory: peekLevelFactory.address,
    },
  )
}
