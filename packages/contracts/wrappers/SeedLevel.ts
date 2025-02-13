import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
} from "@ton/core"

export type SeedLevelConfig = {
  player: Address
  nonce: bigint
  locked: boolean
  seed: bigint
}

export function seedLevelConfigToCell(config: SeedLevelConfig): Cell {
  return beginCell()
    .storeAddress(config.player)
    .storeUint(config.nonce, 32)
    .storeInt(config.locked ? BigInt(-1) : BigInt(0), 1)
    .storeUint(config.seed, 256)
    .endCell()
}

export class SeedLevel implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFromAddress(address: Address) {
    return new SeedLevel(address)
  }

  static createFromConfig(config: SeedLevelConfig, code: Cell, workchain = 0) {
    const data = seedLevelConfigToCell(config)
    const init = { code, data }
    return new SeedLevel(contractAddress(workchain, init), init)
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    })
  }

  async send(
    provider: ContractProvider,
    via: Sender,
    body: Cell,
    value: bigint,
  ) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body,
    })
  }

  async getLocked(provider: ContractProvider) {
    const { stack } = await provider.get("locked", [])
    return stack.readBoolean()
  }

  async getSeed(provider: ContractProvider) {
    const { stack } = await provider.get("seed", [])
    return stack.readBigNumber()
  }
}
