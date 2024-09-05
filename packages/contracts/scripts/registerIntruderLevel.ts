import { Address, toNano } from "@ton/core"
import { GameManager } from "../wrappers/GameManager"
import { IntruderLevelFactory } from "../wrappers/IntruderLevelFactory"
import { NetworkProvider } from "@ton/blueprint"

export async function run(provider: NetworkProvider) {
  const gameManager = provider.open(
    await GameManager.fromAddress(
      Address.parse("EQDQK3Z-JAPhdYx9giabBn2TBulSDtiT5nTyhpoevdtDEW8Q"),
    ),
  )

  const intruderLevelFactory = provider.open(
    await IntruderLevelFactory.fromInit(gameManager.address),
  )

  await intruderLevelFactory.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "Deploy",
      queryId: 0n,
    },
  )

  await provider.waitForDeploy(intruderLevelFactory.address)

  await gameManager.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "RegisterLevel",
      name: "intruder",
      factory: intruderLevelFactory.address,
    },
  )
}
