import { Blockchain, SandboxContract, TreasuryContract } from "@ton/sandbox"
import { toNano } from "@ton/core"
import { Proxy } from "../wrappers/Proxy"
import "@ton/test-utils"

describe("Proxy", () => {
  let blockchain: Blockchain
  let owner: SandboxContract<TreasuryContract>
  let deployer: SandboxContract<TreasuryContract>
  let proxy: SandboxContract<Proxy>

  beforeEach(async () => {
    blockchain = await Blockchain.create()

    owner = await blockchain.treasury("owner")
    proxy = blockchain.openContract(await Proxy.fromInit(owner.address))

    deployer = await blockchain.treasury("deployer")

    const deployResult = await proxy.send(
      deployer.getSender(),
      {
        value: toNano("0.05"),
      },
      {
        $$type: "Deploy",
        queryId: 0n,
      },
    )

    expect(deployResult.transactions).toHaveTransaction({
      from: deployer.address,
      to: proxy.address,
      deploy: true,
      success: true,
    })
  })

  it("should deploy", async () => {
    // the check is done inside beforeEach
    // blockchain and proxy are ready to use
  })

  it("should forward message", async () => {
    const user1 = await blockchain.treasury("user1")
    const user2 = await blockchain.treasury("user2")

    const result = await proxy.send(
      user1.getSender(),
      { value: toNano("0.1") },
      { $$type: "ProxyMessage", str: "Hello", to: user2.address },
    )

    expect(await proxy.getGetCount()).toEqual(1n)
    expect((await proxy.getGetLast()).last_message).toEqual("Hello")
    expect(
      (await proxy.getGetLast()).last_receiver?.equals(user2.address),
    ).toBeTruthy()
    expect(
      (await proxy.getGetLast()).last_sender?.equals(user1.address),
    ).toBeTruthy()
    expect(result.transactions).toHaveTransaction({
      from: user1.address,
      to: proxy.address,
      deploy: false,
      success: true,
    })
    expect(result.transactions).toHaveTransaction({
      from: proxy.address,
      to: user2.address,
      deploy: false,
      success: true,
    })
  })
})
