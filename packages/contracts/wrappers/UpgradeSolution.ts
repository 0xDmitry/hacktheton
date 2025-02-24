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

export type UpgradeSolutionConfig = {
  player: Address
  nonce: bigint
  locked: boolean
}

export function upgradeSolutionConfigToCell(
  config: UpgradeSolutionConfig,
): Cell {
  return beginCell()
    .storeAddress(config.player)
    .storeUint(config.nonce, 32)
    .storeInt(config.locked ? BigInt(-1) : BigInt(0), 1)
    .endCell()
}

export class UpgradeSolution implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFromAddress(address: Address) {
    return new UpgradeSolution(address)
  }

  static createFromConfig(
    config: UpgradeSolutionConfig,
    code: Cell,
    workchain = 0,
  ) {
    const data = upgradeSolutionConfigToCell(config)
    const init = { code, data }
    return new UpgradeSolution(contractAddress(workchain, init), init)
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

  async getLocked(provider: ContractProvider) {
    const { stack } = await provider.get("locked", [])
    return stack.readBoolean()
  }
}
