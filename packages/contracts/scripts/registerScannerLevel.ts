import { Address, toNano } from "@ton/core"
import { GameManager } from "../wrappers/GameManager"
import { ScannerLevelFactory } from "../wrappers/ScannerLevelFactory"
import { NetworkProvider } from "@ton/blueprint"

export async function run(provider: NetworkProvider) {
  const gameManager = provider.open(
    await GameManager.fromAddress(
      Address.parse("EQDQK3Z-JAPhdYx9giabBn2TBulSDtiT5nTyhpoevdtDEW8Q"),
    ),
  )

  const scannerLevelFactory = provider.open(
    await ScannerLevelFactory.fromInit(gameManager.address),
  )

  await scannerLevelFactory.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "Deploy",
      queryId: 0n,
    },
  )

  await provider.waitForDeploy(scannerLevelFactory.address)

  await gameManager.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "RegisterLevel",
      name: "scanner",
      factory: scannerLevelFactory.address,
    },
  )
}
