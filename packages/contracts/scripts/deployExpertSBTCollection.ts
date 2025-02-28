import { Address, toNano } from "@ton/core"
import { RewardSBTCollection } from "../wrappers/RewardSBTCollection"
import { NetworkProvider } from "@ton/blueprint"

export async function run(provider: NetworkProvider) {
  const rewardSBTCollection = provider.open(
    await RewardSBTCollection.fromInit(
      Address.parse("0QC8rz-GAgIMM5dsZwy7xC1Nrf_WxdriXutUD06w21k_7qbq"),
      {
        $$type: "Tep64TokenData",
        flag: 1n,
        content:
          "ipfs://bafybeicra4duvotmwuok4b3eulsquin6rlw75wojkpwkzhxfwlglzvk7qu/expert-sbt-collection.json",
      },
      "ipfs://bafybeicra4duvotmwuok4b3eulsquin6rlw75wojkpwkzhxfwlglzvk7qu/expert-sbt-item",
      Address.parse("EQBIdaDsXQ13Gbddcgi7Vl_9DfyB17sUkJylYqx-OqZWP50-"),
      21n,
    ),
  )

  await rewardSBTCollection.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "Deploy",
      queryId: 0n,
    },
  )

  await provider.waitForDeploy(rewardSBTCollection.address)

  console.log("expert SBT collection address: ", rewardSBTCollection.address)
}
