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

export type LogicalLevelConfig = {
  player: Address
  nonce: bigint
  locked: boolean
  prevLogicalTime: bigint
  logicalTimeDiff: bigint
}

export function logicalLevelConfigToCell(config: LogicalLevelConfig): Cell {
  return beginCell()
    .storeAddress(config.player)
    .storeUint(config.nonce, 32)
    .storeInt(config.locked ? BigInt(-1) : BigInt(0), 1)
    .storeUint(config.prevLogicalTime, 64)
    .storeUint(config.logicalTimeDiff, 32)
    .endCell()
}

export class LogicalLevel implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFromAddress(address: Address) {
    return new LogicalLevel(address)
  }

  static createFromConfig(
    config: LogicalLevelConfig,
    code: Cell,
    workchain = 0,
  ) {
    const data = logicalLevelConfigToCell(config)
    const init = { code, data }
    return new LogicalLevel(contractAddress(workchain, init), init)
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

  async getPrevLogicalTime(provider: ContractProvider) {
    const { stack } = await provider.get("prevLogicalTime", [])
    return stack.readBigNumber()
  }

  async getLogicalTimeDiff(provider: ContractProvider) {
    const { stack } = await provider.get("logicalTimeDiff", [])
    return stack.readBigNumber()
  }
}
