import { Address, OpenedContract } from "@ton/core"
import { ContractAdapter } from "@ton-api/ton-adapter"
import introductionCode from "../../../contracts/contracts/levels/introduction_level.tact"
import depositCode from "../../../contracts/contracts/levels/deposit_level.tact"
import scannerCode from "../../../contracts/contracts/levels/scanner_level.tact"
import bounceCode from "../../../contracts/contracts/levels/bounce_level.tact"
import intruderCode from "../../../contracts/contracts/levels/intruder_level.tact"
import partialCode from "../../../contracts/contracts/levels/partial_level.tact"
import peekCode from "../../../contracts/contracts/levels/peek_level.tact"
import swapCode from "../../../contracts/contracts/levels/swap_level.tact"
import coinCode from "../../../contracts/contracts/levels/coin_level.tact"
import gatekeeperCode from "../../../contracts/contracts/levels/gatekeeper_level.tact"
import bruteforceCode from "../../../contracts/contracts/levels/bruteforce_level.tact"
import tolkCode from "../../../contracts/contracts/levels/tolk_level.tolk"
import upgradeCode from "../../../contracts/contracts/levels/upgrade_level.tolk"
import seedCode from "../../../contracts/contracts/levels/seed_level.tolk"
import { IntroductionLevel } from "../../../contracts/wrappers/IntroductionLevel"
import { DepositLevel } from "../../../contracts/wrappers/DepositLevel"
import { ScannerLevel } from "../../../contracts/wrappers/ScannerLevel"
import { BounceLevel } from "../../../contracts/wrappers/BounceLevel"
import { IntruderLevel } from "../../../contracts/wrappers/IntruderLevel"
import { PartialLevel } from "../../../contracts/wrappers/PartialLevel"
import { PeekLevel } from "../../../contracts/wrappers/PeekLevel"
import { SwapLevel } from "../../../contracts/wrappers/SwapLevel"
import { CoinLevel } from "../../../contracts/wrappers/CoinLevel"
import { GatekeeperLevel } from "../../../contracts/wrappers/GatekeeperLevel"
import { BruteforceLevel } from "../../../contracts/wrappers/BruteforceLevel"
import { TolkLevel } from "../../../contracts/wrappers/TolkLevel"
import { UpgradeLevel } from "../../../contracts/wrappers/UpgradeLevel"
import { SeedLevel } from "../../../contracts/wrappers/SeedLevel"
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
import CoinEnDescription from "@/markdown/en/levels/coin/description.mdx"
import CoinEnCompletedDescription from "@/markdown/en/levels/coin/completed-description.mdx"
import CoinRuDescription from "@/markdown/ru/levels/coin/description.mdx"
import CoinRuCompletedDescription from "@/markdown/ru/levels/coin/completed-description.mdx"
import GatekeeperEnDescription from "@/markdown/en/levels/gatekeeper/description.mdx"
import GatekeeperEnCompletedDescription from "@/markdown/en/levels/gatekeeper/completed-description.mdx"
import GatekeeperRuDescription from "@/markdown/ru/levels/gatekeeper/description.mdx"
import GatekeeperRuCompletedDescription from "@/markdown/ru/levels/gatekeeper/completed-description.mdx"
import BruteforceEnDescription from "@/markdown/en/levels/bruteforce/description.mdx"
import BruteforceEnCompletedDescription from "@/markdown/en/levels/bruteforce/completed-description.mdx"
import BruteforceRuDescription from "@/markdown/ru/levels/bruteforce/description.mdx"
import BruteforceRuCompletedDescription from "@/markdown/ru/levels/bruteforce/completed-description.mdx"
import TolkEnDescription from "@/markdown/en/levels/tolk/description.mdx"
import TolkEnCompletedDescription from "@/markdown/en/levels/tolk/completed-description.mdx"
import TolkRuDescription from "@/markdown/ru/levels/tolk/description.mdx"
import TolkRuCompletedDescription from "@/markdown/ru/levels/tolk/completed-description.mdx"
import UpgradeEnDescription from "@/markdown/en/levels/upgrade/description.mdx"
import UpgradeEnCompletedDescription from "@/markdown/en/levels/upgrade/completed-description.mdx"
import UpgradeRuDescription from "@/markdown/ru/levels/upgrade/description.mdx"
import UpgradeRuCompletedDescription from "@/markdown/ru/levels/upgrade/completed-description.mdx"
import SeedEnDescription from "@/markdown/en/levels/seed/description.mdx"
import SeedEnCompletedDescription from "@/markdown/en/levels/seed/completed-description.mdx"
import SeedRuDescription from "@/markdown/ru/levels/seed/description.mdx"
import SeedRuCompletedDescription from "@/markdown/ru/levels/seed/completed-description.mdx"

export type LevelName =
  | "introduction"
  | "deposit"
  | "scanner"
  | "bounce"
  | "intruder"
  | "partial"
  | "peek"
  | "swap"
  | "coin"
  | "gatekeeper"
  | "bruteforce"
  | "tolk"
  | "upgrade"
  | "seed"

export const levels: LevelName[] = [
  "introduction",
  "deposit",
  "scanner",
  "bounce",
  "intruder",
  "partial",
  "peek",
  "swap",
  "coin",
  "gatekeeper",
  "bruteforce",
  "tolk",
  "upgrade",
  "seed",
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
  coin: {
    description: {
      en: <CoinEnDescription />,
      ru: <CoinRuDescription />,
    },
    completedDescription: {
      en: <CoinEnCompletedDescription />,
      ru: <CoinRuCompletedDescription />,
    },
    code: coinCode,
    revealCode: true,
    openLevelContract: async (
      levelInstance: Address,
      clientAdapter: ContractAdapter,
    ) => {
      const contract = await CoinLevel.fromAddress(levelInstance!)
      return clientAdapter!.open(contract) as OpenedContract<CoinLevel>
    },
  },
  gatekeeper: {
    description: {
      en: <GatekeeperEnDescription />,
      ru: <GatekeeperRuDescription />,
    },
    completedDescription: {
      en: <GatekeeperEnCompletedDescription />,
      ru: <GatekeeperRuCompletedDescription />,
    },
    code: gatekeeperCode,
    revealCode: true,
    openLevelContract: async (
      levelInstance: Address,
      clientAdapter: ContractAdapter,
    ) => {
      const contract = await GatekeeperLevel.fromAddress(levelInstance!)
      return clientAdapter!.open(contract) as OpenedContract<GatekeeperLevel>
    },
  },
  bruteforce: {
    description: {
      en: <BruteforceEnDescription />,
      ru: <BruteforceRuDescription />,
    },
    completedDescription: {
      en: <BruteforceEnCompletedDescription />,
      ru: <BruteforceRuCompletedDescription />,
    },
    code: bruteforceCode,
    revealCode: true,
    openLevelContract: async (
      levelInstance: Address,
      clientAdapter: ContractAdapter,
    ) => {
      const contract = await BruteforceLevel.fromAddress(levelInstance!)
      return clientAdapter!.open(contract) as OpenedContract<BruteforceLevel>
    },
  },
  tolk: {
    description: {
      en: <TolkEnDescription />,
      ru: <TolkRuDescription />,
    },
    completedDescription: {
      en: <TolkEnCompletedDescription />,
      ru: <TolkRuCompletedDescription />,
    },
    code: tolkCode,
    revealCode: true,
    openLevelContract: async (
      levelInstance: Address,
      clientAdapter: ContractAdapter,
    ) => {
      const contract = await TolkLevel.createFromAddress(levelInstance!)
      return clientAdapter!.open(contract) as OpenedContract<TolkLevel>
    },
  },
  upgrade: {
    description: {
      en: <UpgradeEnDescription />,
      ru: <UpgradeRuDescription />,
    },
    completedDescription: {
      en: <UpgradeEnCompletedDescription />,
      ru: <UpgradeRuCompletedDescription />,
    },
    code: upgradeCode,
    revealCode: true,
    openLevelContract: async (
      levelInstance: Address,
      clientAdapter: ContractAdapter,
    ) => {
      const contract = await UpgradeLevel.createFromAddress(levelInstance!)
      return clientAdapter!.open(contract) as OpenedContract<UpgradeLevel>
    },
  },
  seed: {
    description: {
      en: <SeedEnDescription />,
      ru: <SeedRuDescription />,
    },
    completedDescription: {
      en: <SeedEnCompletedDescription />,
      ru: <SeedRuCompletedDescription />,
    },
    code: seedCode,
    revealCode: true,
    openLevelContract: async (
      levelInstance: Address,
      clientAdapter: ContractAdapter,
    ) => {
      const contract = await SeedLevel.createFromAddress(levelInstance!)
      return clientAdapter!.open(contract) as OpenedContract<SeedLevel>
    },
  },
} as const
