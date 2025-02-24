import { Address, toNano } from "@ton/core"
import { Leaderboard } from "../wrappers/Leaderboard"
import { NetworkProvider } from "@ton/blueprint"

export async function run(provider: NetworkProvider) {
  const leaderboard = provider.open(
    await Leaderboard.fromInit(
      Address.parse("EQBIdaDsXQ13Gbddcgi7Vl_9DfyB17sUkJylYqx-OqZWP50-"),
    ),
  )

  await leaderboard.send(
    provider.sender(),
    {
      value: toNano("0.05"),
    },
    {
      $$type: "Deploy",
      queryId: 0n,
    },
  )

  await provider.waitForDeploy(leaderboard.address)

  console.log("leaderboard address: ", leaderboard.address)
}
