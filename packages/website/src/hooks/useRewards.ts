"use client"

import { useState } from "react"
import { Address, OpenedContract, toNano } from "@ton/core"
import { RewardSBTCollection } from "../../../contracts/wrappers/RewardSBTCollection"
import { useContractAdapter } from "./useContractAdapter"
import { useTonApiClient } from "./useTonApiClient"
import { useAsyncInitialize } from "./useAsyncInitialize"
import { useTonConnect } from "./useTonConnect"
import { usePollingEffect } from "./usePollingEffect"
import { NftItem } from "@ton-api/client"

export function useRewards() {
  const contractAdapter = useContractAdapter()
  const { sender } = useTonConnect()
  const tonApiClient = useTonApiClient()

  const [claimedBeginnerSBT, setClaimedBeginnerSBT] = useState(false)
  const [claimedAdvancedSBT, setClaimedAdvancedSBT] = useState(false)
  const [claimedExpertSBT, setClaimedExpertSBT] = useState(false)

  usePollingEffect(
    async () => {
      let items
      try {
        items = (
          await tonApiClient?.nft.getItemsFromCollection(
            Address.parse(
              process.env.NEXT_PUBLIC_BEGINNER_SBT_COLLECTION_ADDRESS!,
            ),
          )
        )?.nftItems
      } catch {
        items = []
      }
      setClaimedBeginnerSBT(
        !!(
          sender.address &&
          items?.some((nftItem: NftItem) =>
            nftItem.owner?.address.equals(sender.address!),
          )
        ),
      )
    },
    [tonApiClient, sender],
    { interval: 2000 },
  )

  usePollingEffect(
    async () => {
      let items
      try {
        items = (
          await tonApiClient?.nft.getItemsFromCollection(
            Address.parse(
              process.env.NEXT_PUBLIC_ADVANCED_SBT_COLLECTION_ADDRESS!,
            ),
          )
        )?.nftItems
      } catch {
        items = []
      }
      setClaimedAdvancedSBT(
        !!(
          sender.address &&
          items?.some((nftItem: NftItem) =>
            nftItem.owner?.address.equals(sender.address!),
          )
        ),
      )
    },
    [tonApiClient, sender],
    { interval: 2000 },
  )

  usePollingEffect(
    async () => {
      let items
      try {
        items = (
          await tonApiClient?.nft.getItemsFromCollection(
            Address.parse(
              process.env.NEXT_PUBLIC_EXPERT_SBT_COLLECTION_ADDRESS!,
            ),
          )
        )?.nftItems
      } catch {
        items = []
      }
      setClaimedExpertSBT(
        !!(
          sender.address &&
          items?.some((nftItem: NftItem) =>
            nftItem.owner?.address.equals(sender.address!),
          )
        ),
      )
    },
    [tonApiClient, sender],
    { interval: 2000 },
  )

  const beginnerSBTCollection = useAsyncInitialize(async () => {
    if (!contractAdapter) return
    const contract = RewardSBTCollection.fromAddress(
      Address.parse(process.env.NEXT_PUBLIC_BEGINNER_SBT_COLLECTION_ADDRESS!),
    )
    return contractAdapter.open(contract) as OpenedContract<RewardSBTCollection>
  }, [contractAdapter])

  const advancedSBTCollection = useAsyncInitialize(async () => {
    if (!contractAdapter) return
    const contract = RewardSBTCollection.fromAddress(
      Address.parse(process.env.NEXT_PUBLIC_ADVANCED_SBT_COLLECTION_ADDRESS!),
    )
    return contractAdapter.open(contract) as OpenedContract<RewardSBTCollection>
  }, [contractAdapter])

  const expertSBTCollection = useAsyncInitialize(async () => {
    if (!contractAdapter) return
    const contract = RewardSBTCollection.fromAddress(
      Address.parse(process.env.NEXT_PUBLIC_EXPERT_SBT_COLLECTION_ADDRESS!),
    )
    return contractAdapter.open(contract) as OpenedContract<RewardSBTCollection>
  }, [contractAdapter])

  return {
    claimedBeginnerSBT,
    claimedAdvancedSBT,
    claimedExpertSBT,
    sendMintBeginnerSBT: () => {
      return beginnerSBTCollection?.send(
        sender,
        { value: toNano("0.2") },
        {
          $$type: "MintNFT",
          queryId: BigInt(0),
          receiver: sender.address!,
          responseDestination: sender.address!,
          forwardAmount: BigInt(0),
          forwardPayload: null,
        },
      )
    },
    sendMintAdvancedSBT: () => {
      return advancedSBTCollection?.send(
        sender,
        { value: toNano("0.2") },
        {
          $$type: "MintNFT",
          queryId: BigInt(0),
          receiver: sender.address!,
          responseDestination: sender.address!,
          forwardAmount: BigInt(0),
          forwardPayload: null,
        },
      )
    },
    sendMintExpertSBT: () => {
      return expertSBTCollection?.send(
        sender,
        { value: toNano("0.2") },
        {
          $$type: "MintNFT",
          queryId: BigInt(0),
          receiver: sender.address!,
          responseDestination: sender.address!,
          forwardAmount: BigInt(0),
          forwardPayload: null,
        },
      )
    },
  }
}
