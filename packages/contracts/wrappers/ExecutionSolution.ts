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

export type ExecutionSolutionConfig = {}

export function executionSolutionConfigToCell(
  config: ExecutionSolutionConfig,
): Cell {
  return beginCell().endCell()
}

export class ExecutionSolution implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFromAddress(address: Address) {
    return new ExecutionSolution(address)
  }

  static createFromConfig(
    config: ExecutionSolutionConfig,
    code: Cell,
    workchain = 0,
  ) {
    const data = executionSolutionConfigToCell(config)
    const init = { code, data }
    return new ExecutionSolution(contractAddress(workchain, init), init)
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
