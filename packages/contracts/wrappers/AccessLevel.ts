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

export type AccessLevelConfig = {
  player: Address
  nonce: bigint
  owner: Address
  locked: Boolean
}

export function accessLevelConfigToCell(config: AccessLevelConfig): Cell {
  return beginCell()
    .storeAddress(config.player)
    .storeUint(config.nonce, 32)
    .storeAddress(config.owner)
    .storeInt(config.locked ? BigInt(-1) : BigInt(0), 1)
    .endCell()
}

export class AccessLevel implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFromAddress(address: Address) {
    return new AccessLevel(address)
  }

  static createFromConfig(
    config: AccessLevelConfig,
    code: Cell,
    workchain = 0,
  ) {
    const data = accessLevelConfigToCell(config)
    const init = { code, data }
    return new AccessLevel(contractAddress(workchain, init), init)
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

  async getNonce(provider: ContractProvider) {
    const { stack } = await provider.get("nonce", [])
    return stack.readBigNumber()
  }

  async getOwner(provider: ContractProvider) {
    const { stack } = await provider.get("owner", [])
    return stack.readAddress()
  }

  async getLocked(provider: ContractProvider) {
    const { stack } = await provider.get("locked", [])
    return stack.readBoolean()
  }
}
