import { Address, toNano } from "@ton/core"
import { GameManager } from "../wrappers/GameManager"
import { TolkLevelFactory } from "../wrappers/TolkLevelFactory"
import { compile, NetworkProvider } from "@ton/blueprint"

export async function run(provider: NetworkProvider) {
  const gameManager = provider.open(
    await GameManager.fromAddress(
      Address.parse("EQBIdaDsXQ13Gbddcgi7Vl_9DfyB17sUkJylYqx-OqZWP50-"),
    ),
  )

  const tolkLevelFactory = provider.open(
    await TolkLevelFactory.fromInit(
      gameManager.address,
      await compile("TolkLevel"),
    ),
  )

  await tolkLevelFactory.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "Deploy",
      queryId: 0n,
    },
  )

  await provider.waitForDeploy(tolkLevelFactory.address)

  await gameManager.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "RegisterLevel",
      name: "tolk",
      factory: tolkLevelFactory.address,
    },
  )
}
