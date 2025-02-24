import { Address, toNano } from "@ton/core"
import { GameManager } from "../wrappers/GameManager"
import { TokenLevelFactory } from "../wrappers/TokenLevelFactory"
import { compile, NetworkProvider } from "@ton/blueprint"

export async function run(provider: NetworkProvider) {
  const gameManager = provider.open(
    await GameManager.fromAddress(
      Address.parse("EQBIdaDsXQ13Gbddcgi7Vl_9DfyB17sUkJylYqx-OqZWP50-"),
    ),
  )

  const tokenLevelFactory = provider.open(
    await TokenLevelFactory.fromInit(
      gameManager.address,
      await compile("TokenLevel"),
    ),
  )

  await tokenLevelFactory.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "Deploy",
      queryId: 0n,
    },
  )

  await provider.waitForDeploy(tokenLevelFactory.address)

  await gameManager.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "RegisterLevel",
      name: "token",
      factory: tokenLevelFactory.address,
    },
  )
}
