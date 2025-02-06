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

export type UpgradeLevelConfig = {
  player: Address
  nonce: bigint
  locked: Boolean
}

export function upgradeLevelConfigToCell(config: UpgradeLevelConfig): Cell {
  return beginCell()
    .storeAddress(config.player)
    .storeUint(config.nonce, 32)
    .storeInt(config.locked ? BigInt(-1) : BigInt(0), 1)
    .endCell()
}

export class UpgradeLevel implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFromAddress(address: Address) {
    return new UpgradeLevel(address)
  }

  static createFromConfig(
    config: UpgradeLevelConfig,
    code: Cell,
    workchain = 0,
  ) {
    const data = upgradeLevelConfigToCell(config)
    const init = { code, data }
    return new UpgradeLevel(contractAddress(workchain, init), init)
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
