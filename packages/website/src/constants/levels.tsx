import { Address, OpenedContract } from "@ton/core"
import { ContractAdapter } from "@ton-api/ton-adapter"
import introductionCode from "../../../contracts/contracts/introduction_level.tact"
import { IntroductionLevel } from "../../../contracts/wrappers/IntroductionLevel"
import IntroductionDescription from "../markdown/levels/introduction/description.mdx"
import IntroductionCompletedDescription from "../markdown/levels/introduction/completed-description.mdx"

export type LevelName = "introduction"

export const levels: LevelName[] = ["introduction"]

export const levelsConfig = {
  introduction: {
    description: <IntroductionDescription />,
    completedDescription: <IntroductionCompletedDescription />,
    code: introductionCode,
    revealCode: false,
    openLevelContract: async (
      levelInstance: Address,
      clientAdapter: ContractAdapter,
    ) => {
      const contract = await IntroductionLevel.fromAddress(levelInstance!)
      return clientAdapter!.open(contract) as OpenedContract<IntroductionLevel>
    },
  },
} as const
