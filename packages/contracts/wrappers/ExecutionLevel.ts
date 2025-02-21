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

export type ExecutionLevelConfig = {
  player: Address
  nonce: bigint
}

export function executionLevelConfigToCell(config: ExecutionLevelConfig): Cell {
  return beginCell()
    .storeAddress(config.player)
    .storeUint(config.nonce, 32)
    .endCell()
}

export class ExecutionLevel implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFromAddress(address: Address) {
    return new ExecutionLevel(address)
  }

  static createFromConfig(
    config: ExecutionLevelConfig,
    code: Cell,
    workchain = 0,
  ) {
    const data = executionLevelConfigToCell(config)
    const init = { code, data }
    return new ExecutionLevel(contractAddress(workchain, init), init)
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

  async getBalance(provider: ContractProvider) {
    const { stack } = await provider.get("balance", [])
    return stack.readBigNumber()
  }
}
