import { Address, toNano } from "@ton/core"
import { GameManager } from "../wrappers/GameManager"
import { IntroductionLevelFactory } from "../wrappers/IntroductionLevelFactory"
import { NetworkProvider } from "@ton/blueprint"

export async function run(provider: NetworkProvider) {
  const gameManager = provider.open(
    await GameManager.fromInit(
      Address.parse("0QC8rz-GAgIMM5dsZwy7xC1Nrf_WxdriXutUD06w21k_7qbq"),
    ),
  )

  await gameManager.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "Deploy",
      queryId: 0n,
    },
  )

  await provider.waitForDeploy(gameManager.address)

  const introductionLevelFactory = provider.open(
    await IntroductionLevelFactory.fromInit(gameManager.address),
  )

  await introductionLevelFactory.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "Deploy",
      queryId: 0n,
    },
  )

  await provider.waitForDeploy(introductionLevelFactory.address)

  await gameManager.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "RegisterLevel",
      name: "introduction",
      factory: introductionLevelFactory.address,
    },
  )

  console.log("game manager address: ", gameManager.address)
}
