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

export type LogicalSolutionConfig = {}

export function logicalSolutionConfigToCell(
  config: LogicalSolutionConfig,
): Cell {
  return beginCell().endCell()
}

export class LogicalSolution implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFromAddress(address: Address) {
    return new LogicalSolution(address)
  }

  static createFromConfig(
    config: LogicalSolutionConfig,
    code: Cell,
    workchain = 0,
  ) {
    const data = logicalSolutionConfigToCell(config)
    const init = { code, data }
    return new LogicalSolution(contractAddress(workchain, init), init)
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
      sendMode: SendMode.PAY_GAS_SEPARATELY,
      body,
      value: value,
    })
  }
}
