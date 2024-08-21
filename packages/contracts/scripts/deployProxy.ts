import { Address, toNano } from "@ton/core"
import { Proxy } from "../wrappers/Proxy"
import { NetworkProvider } from "@ton/blueprint"

export async function run(provider: NetworkProvider) {
  const proxy = provider.open(
    await Proxy.fromInit(
      Address.parse("0QBHpCsjmgQESLwOr2C3t3Bc85kQ-J3QMbLgHRz9htsR6M7B"),
    ),
  )

  await proxy.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "Deploy",
      queryId: 0n,
    },
  )

  await provider.waitForDeploy(proxy.address)

  console.log("Owner: ", await proxy.getOwner())
}
