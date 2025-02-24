import { Address, toNano } from "@ton/core"
import { GameManager } from "../wrappers/GameManager"
import { ExecutionLevelFactory } from "../wrappers/ExecutionLevelFactory"
import { compile, NetworkProvider } from "@ton/blueprint"

export async function run(provider: NetworkProvider) {
  const gameManager = provider.open(
    await GameManager.fromAddress(
      Address.parse("EQBIdaDsXQ13Gbddcgi7Vl_9DfyB17sUkJylYqx-OqZWP50-"),
    ),
  )

  const executionLevelFactory = provider.open(
    await ExecutionLevelFactory.fromInit(
      gameManager.address,
      await compile("ExecutionLevel"),
    ),
  )

  await executionLevelFactory.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "Deploy",
      queryId: 0n,
    },
  )

  await provider.waitForDeploy(executionLevelFactory.address)

  await gameManager.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "RegisterLevel",
      name: "execution",
      factory: executionLevelFactory.address,
    },
  )
}
