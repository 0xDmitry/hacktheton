import { Address, OpenedContract } from "@ton/core"
import { ContractAdapter } from "@ton-api/ton-adapter"
import introductionCode from "../../../contracts/contracts/introduction_level.tact"
import depositCode from "../../../contracts/contracts/deposit_level.tact"
import scannerCode from "../../../contracts/contracts/scanner_level.tact"
import bounceCode from "../../../contracts/contracts/bounce_level.tact"
import intruderCode from "../../../contracts/contracts/intruder_level.tact"
import partialCode from "../../../contracts/contracts/partial_level.tact"
import peekCode from "../../../contracts/contracts/peek_level.tact"
import swapCode from "../../../contracts/contracts/swap_level.tact"
import { IntroductionLevel } from "../../../contracts/wrappers/IntroductionLevel"
import { DepositLevel } from "../../../contracts/wrappers/DepositLevel"
import { ScannerLevel } from "../../../contracts/wrappers/ScannerLevel"
import { BounceLevel } from "../../../contracts/wrappers/BounceLevel"
import { IntruderLevel } from "../../../contracts/wrappers/IntruderLevel"
import { PartialLevel } from "../../../contracts/wrappers/PartialLevel"
import { PeekLevel } from "../../../contracts/wrappers/PeekLevel"
import { SwapLevel } from "../../../contracts/wrappers/SwapLevel"
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
import IntruderEnDescription from "@/markdown/en/levels/intruder/description.mdx"
import IntruderEnCompletedDescription from "@/markdown/en/levels/intruder/completed-description.mdx"
import IntruderRuDescription from "@/markdown/ru/levels/intruder/description.mdx"
import IntruderRuCompletedDescription from "@/markdown/ru/levels/intruder/completed-description.mdx"
import PartialEnDescription from "@/markdown/en/levels/partial/description.mdx"
import PartialEnCompletedDescription from "@/markdown/en/levels/partial/completed-description.mdx"
import PartialRuDescription from "@/markdown/ru/levels/partial/description.mdx"
import PartialRuCompletedDescription from "@/markdown/ru/levels/partial/completed-description.mdx"
import PeekEnDescription from "@/markdown/en/levels/peek/description.mdx"
import PeekEnCompletedDescription from "@/markdown/en/levels/peek/completed-description.mdx"
import PeekRuDescription from "@/markdown/ru/levels/peek/description.mdx"
import PeekRuCompletedDescription from "@/markdown/ru/levels/peek/completed-description.mdx"
import SwapEnDescription from "@/markdown/en/levels/swap/description.mdx"
import SwapEnCompletedDescription from "@/markdown/en/levels/swap/completed-description.mdx"
import SwapRuDescription from "@/markdown/ru/levels/swap/description.mdx"
import SwapRuCompletedDescription from "@/markdown/ru/levels/swap/completed-description.mdx"

export type LevelName =
  | "introduction"
  | "deposit"
  | "scanner"
  | "bounce"
  | "intruder"
  | "partial"
  | "peek"
  | "swap"

export const levels: LevelName[] = [
  "introduction",
  "deposit",
  "scanner",
  "bounce",
  "intruder",
  "partial",
  "peek",
  "swap",
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
      return clientAdapter!.open(contract) as OpenedContract<ScannerLevel>
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
      return clientAdapter!.open(contract) as OpenedContract<BounceLevel>
    },
  },
  intruder: {
    description: {
      en: <IntruderEnDescription />,
      ru: <IntruderRuDescription />,
    },
    completedDescription: {
      en: <IntruderEnCompletedDescription />,
      ru: <IntruderRuCompletedDescription />,
    },
    code: intruderCode,
    revealCode: true,
    openLevelContract: async (
      levelInstance: Address,
      clientAdapter: ContractAdapter,
    ) => {
      const contract = await IntruderLevel.fromAddress(levelInstance!)
      return clientAdapter!.open(contract) as OpenedContract<IntruderLevel>
    },
  },
  partial: {
    description: {
      en: <PartialEnDescription />,
      ru: <PartialRuDescription />,
    },
    completedDescription: {
      en: <PartialEnCompletedDescription />,
      ru: <PartialRuCompletedDescription />,
    },
    code: partialCode,
    revealCode: true,
    openLevelContract: async (
      levelInstance: Address,
      clientAdapter: ContractAdapter,
    ) => {
      const contract = await PartialLevel.fromAddress(levelInstance!)
      return clientAdapter!.open(contract) as OpenedContract<PartialLevel>
    },
  },
  peek: {
    description: {
      en: <PeekEnDescription />,
      ru: <PeekRuDescription />,
    },
    completedDescription: {
      en: <PeekEnCompletedDescription />,
      ru: <PeekRuCompletedDescription />,
    },
    code: peekCode,
    revealCode: true,
    openLevelContract: async (
      levelInstance: Address,
      clientAdapter: ContractAdapter,
    ) => {
      const contract = await PeekLevel.fromAddress(levelInstance!)
      return clientAdapter!.open(contract) as OpenedContract<PeekLevel>
    },
  },
  swap: {
    description: {
      en: <SwapEnDescription />,
      ru: <SwapRuDescription />,
    },
    completedDescription: {
      en: <SwapEnCompletedDescription />,
      ru: <SwapRuCompletedDescription />,
    },
    code: swapCode,
    revealCode: true,
    openLevelContract: async (
      levelInstance: Address,
      clientAdapter: ContractAdapter,
    ) => {
      const contract = await SwapLevel.fromAddress(levelInstance!)
      return clientAdapter!.open(contract) as OpenedContract<SwapLevel>
    },
  },
} as const
