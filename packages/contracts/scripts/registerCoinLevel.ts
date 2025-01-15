import { Address, toNano } from "@ton/core"
import { GameManager } from "../wrappers/GameManager"
import { CoinLevelFactory } from "../wrappers/CoinLevelFactory"
import { NetworkProvider } from "@ton/blueprint"

export async function run(provider: NetworkProvider) {
  const gameManager = provider.open(
    await GameManager.fromAddress(
      Address.parse("EQBIdaDsXQ13Gbddcgi7Vl_9DfyB17sUkJylYqx-OqZWP50-"),
    ),
  )

  const coinLevelFactory = provider.open(
    await CoinLevelFactory.fromInit(gameManager.address),
  )

  await coinLevelFactory.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "Deploy",
      queryId: 0n,
    },
  )

  await provider.waitForDeploy(coinLevelFactory.address)

  await gameManager.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "RegisterLevel",
      name: "coin",
      factory: coinLevelFactory.address,
    },
  )
}
