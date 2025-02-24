import { Address, toNano } from "@ton/core"
import { GameManager } from "../wrappers/GameManager"
import { DonateLevelFactory } from "../wrappers/DonateLevelFactory"
import { compile, NetworkProvider } from "@ton/blueprint"

export async function run(provider: NetworkProvider) {
  const gameManager = provider.open(
    await GameManager.fromAddress(
      Address.parse("EQBIdaDsXQ13Gbddcgi7Vl_9DfyB17sUkJylYqx-OqZWP50-"),
    ),
  )

  const donateLevelFactory = provider.open(
    await DonateLevelFactory.fromInit(
      gameManager.address,
      await compile("DonateLevel"),
    ),
  )

  await donateLevelFactory.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "Deploy",
      queryId: 0n,
    },
  )

  await provider.waitForDeploy(donateLevelFactory.address)

  await gameManager.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "RegisterLevel",
      name: "donate",
      factory: donateLevelFactory.address,
    },
  )
}
