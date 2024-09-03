import { Address, toNano } from "@ton/core"
import { GameManager } from "../wrappers/GameManager"
import { DepositLevelFactory } from "../wrappers/DepositLevelFactory"
import { NetworkProvider } from "@ton/blueprint"

export async function run(provider: NetworkProvider) {
  const gameManager = provider.open(
    await GameManager.fromAddress(
      Address.parse("EQDWY1uFdJcjAU682o0JicTBl5f2wkx55zNs09-6tpHMIjbf"),
    ),
  )

  const depositLevelFactory = provider.open(
    await DepositLevelFactory.fromInit(gameManager.address),
  )

  await depositLevelFactory.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "Deploy",
      queryId: 0n,
    },
  )

  await provider.waitForDeploy(depositLevelFactory.address)

  await gameManager.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "RegisterLevel",
      name: "deposit",
      factory: depositLevelFactory.address,
    },
  )
}