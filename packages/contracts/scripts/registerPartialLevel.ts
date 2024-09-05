import { Address, toNano } from "@ton/core"
import { GameManager } from "../wrappers/GameManager"
import { PartialLevelFactory } from "../wrappers/PartialLevelFactory"
import { NetworkProvider } from "@ton/blueprint"

export async function run(provider: NetworkProvider) {
  const gameManager = provider.open(
    await GameManager.fromAddress(
      Address.parse("EQDQK3Z-JAPhdYx9giabBn2TBulSDtiT5nTyhpoevdtDEW8Q"),
    ),
  )

  const partialLevelFactory = provider.open(
    await PartialLevelFactory.fromInit(gameManager.address),
  )

  await partialLevelFactory.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "Deploy",
      queryId: 0n,
    },
  )

  await provider.waitForDeploy(partialLevelFactory.address)

  await gameManager.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "RegisterLevel",
      name: "partial",
      factory: partialLevelFactory.address,
    },
  )
}
