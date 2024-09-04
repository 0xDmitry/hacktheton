import { Address, OpenedContract } from "@ton/core"
import { ContractAdapter } from "@ton-api/ton-adapter"
import introductionCode from "../../../contracts/contracts/introduction_level.tact"
import depositCode from "../../../contracts/contracts/deposit_level.tact"
import scannerCode from "../../../contracts/contracts/scanner_level.tact"
import bounceCode from "../../../contracts/contracts/bounce_level.tact"
import { IntroductionLevel } from "../../../contracts/wrappers/IntroductionLevel"
import { DepositLevel } from "../../../contracts/wrappers/DepositLevel"
import { ScannerLevel } from "../../../contracts/wrappers/ScannerLevel"
import { BounceLevel } from "../../../contracts/wrappers/BounceLevel"
import IntroductionEnDescription from "@/markdown/en/levels/introduction/description.mdx"
import IntroductionEnCompletedDescription from "@/markdown/en/levels/introduction/completed-description.mdx"
import IntroductionRuDescription from "@/markdown/ru/levels/introduction/description.mdx"
import IntroductionRuCompletedDescription from "@/markdown/ru/levels/introduction/completed-description.mdx"
import DepositEnDescription from "@/markdown/en/levels/deposit/description.mdx"
import DepositEnCompletedDescription from "@/markdown/en/levels/deposit/completed-description.mdx"
import DepositRuDescription from "@/markdown/ru/levels/deposit/description.mdx"
import DepositRuCompletedDescription from "@/markdown/ru/levels/deposit/completed-description.mdx"
import ScannerEnDescription from "@/markdown/en/levels/scanner/description.mdx"
import ScannerEnCompletedDescription from "@/markdown/en/levels/scanner/completed-description.mdx"
import ScannerRuDescription from "@/markdown/ru/levels/scanner/description.mdx"
import ScannerRuCompletedDescription from "@/markdown/ru/levels/scanner/completed-description.mdx"
import BounceEnDescription from "@/markdown/en/levels/bounce/description.mdx"
import BounceEnCompletedDescription from "@/markdown/en/levels/bounce/completed-description.mdx"
import BounceRuDescription from "@/markdown/ru/levels/bounce/description.mdx"
import BounceRuCompletedDescription from "@/markdown/ru/levels/bounce/completed-description.mdx"

export type LevelName = "introduction" | "deposit" | "scanner" | "bounce"

export const levels: LevelName[] = [
  "introduction",
  "deposit",
  "scanner",
  "bounce",
]

export const levelsConfig = {
  introduction: {
    description: {
      en: <IntroductionEnDescription />,
      ru: <IntroductionRuDescription />,
    },
    completedDescription: {
      en: <IntroductionEnCompletedDescription />,
      ru: <IntroductionRuCompletedDescription />,
    },
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
  deposit: {
    description: {
      en: <DepositEnDescription />,
      ru: <DepositRuDescription />,
    },
    completedDescription: {
      en: <DepositEnCompletedDescription />,
      ru: <DepositRuCompletedDescription />,
    },
    code: depositCode,
    revealCode: true,
    openLevelContract: async (
      levelInstance: Address,
      clientAdapter: ContractAdapter,
    ) => {
      const contract = await DepositLevel.fromAddress(levelInstance!)
      return clientAdapter!.open(contract) as OpenedContract<DepositLevel>
    },
  },
  scanner: {
    description: {
      en: <ScannerEnDescription />,
      ru: <ScannerRuDescription />,
    },
    completedDescription: {
      en: <ScannerEnCompletedDescription />,
      ru: <ScannerRuCompletedDescription />,
    },
    code: scannerCode,
    revealCode: true,
    openLevelContract: async (
      levelInstance: Address,
      clientAdapter: ContractAdapter,
    ) => {
      const contract = await ScannerLevel.fromAddress(levelInstance!)
      return clientAdapter!.open(contract) as OpenedContract<DepositLevel>
    },
  },
  bounce: {
    description: {
      en: <BounceEnDescription />,
      ru: <BounceRuDescription />,
    },
    completedDescription: {
      en: <BounceEnCompletedDescription />,
      ru: <BounceRuCompletedDescription />,
    },
    code: bounceCode,
    revealCode: true,
    openLevelContract: async (
      levelInstance: Address,
      clientAdapter: ContractAdapter,
    ) => {
      const contract = await BounceLevel.fromAddress(levelInstance!)
      return clientAdapter!.open(contract) as OpenedContract<DepositLevel>
    },
  },
} as const
