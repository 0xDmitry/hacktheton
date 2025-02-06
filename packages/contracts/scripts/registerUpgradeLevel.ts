import { Address, toNano } from "@ton/core"
import { GameManager } from "../wrappers/GameManager"
import { UpgradeLevelFactory } from "../wrappers/UpgradeLevelFactory"
import { compile, NetworkProvider } from "@ton/blueprint"

export async function run(provider: NetworkProvider) {
  const gameManager = provider.open(
    await GameManager.fromAddress(
      Address.parse("EQBIdaDsXQ13Gbddcgi7Vl_9DfyB17sUkJylYqx-OqZWP50-"),
    ),
  )

  const upgradeLevelFactory = provider.open(
    await UpgradeLevelFactory.fromInit(
      gameManager.address,
      await compile("UpgradeLevel"),
    ),
  )

  await upgradeLevelFactory.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "Deploy",
      queryId: 0n,
    },
  )

  await provider.waitForDeploy(upgradeLevelFactory.address)

  await gameManager.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "RegisterLevel",
      name: "upgrade",
      factory: upgradeLevelFactory.address,
    },
  )
}
