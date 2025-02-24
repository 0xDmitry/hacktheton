import { Address, toNano } from "@ton/core"
import { GameManager } from "../wrappers/GameManager"
import { AccessLevelFactory } from "../wrappers/AccessLevelFactory"
import { compile, NetworkProvider } from "@ton/blueprint"

export async function run(provider: NetworkProvider) {
  const gameManager = provider.open(
    await GameManager.fromAddress(
      Address.parse("EQBIdaDsXQ13Gbddcgi7Vl_9DfyB17sUkJylYqx-OqZWP50-"),
    ),
  )

  const accessLevelFactory = provider.open(
    await AccessLevelFactory.fromInit(
      gameManager.address,
      await compile("AccessLevel"),
    ),
  )

  await accessLevelFactory.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "Deploy",
      queryId: 0n,
    },
  )

  await provider.waitForDeploy(accessLevelFactory.address)

  await gameManager.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "RegisterLevel",
      name: "access",
      factory: accessLevelFactory.address,
    },
  )
}
