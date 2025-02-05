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

export type TolkLevelConfig = {
  player: Address
  nonce: bigint
  locked: Boolean
}

export function tolkLevelConfigToCell(config: TolkLevelConfig): Cell {
  return beginCell()
    .storeAddress(config.player)
    .storeUint(config.nonce, 32)
    .storeInt(config.locked ? BigInt(-1) : BigInt(0), 1)
    .endCell()
}

export class TolkLevel implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFromAddress(address: Address) {
    return new TolkLevel(address)
  }

  static createFromConfig(config: TolkLevelConfig, code: Cell, workchain = 0) {
    const data = tolkLevelConfigToCell(config)
    const init = { code, data }
    return new TolkLevel(contractAddress(workchain, init), init)
  }

  async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      value,
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().endCell(),
    })
  }

  async sendUnlock(provider: ContractProvider, via: Sender, value: bigint) {
    await provider.internal(via, {
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body: beginCell().storeUint(0xf0fd50bb, 32).endCell(),
      value: value,
    })
  }
}
