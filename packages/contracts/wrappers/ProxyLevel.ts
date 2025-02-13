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

export type ProxyLevelConfig = {
  player: Address
  nonce: bigint
  owner: Address
  enabled: boolean
}

export function proxyLevelConfigToCell(config: ProxyLevelConfig): Cell {
  return beginCell()
    .storeAddress(config.player)
    .storeUint(config.nonce, 32)
    .storeAddress(config.owner)
    .storeInt(config.enabled ? BigInt(-1) : BigInt(0), 1)
    .endCell()
}

export class ProxyLevel implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFromAddress(address: Address) {
    return new ProxyLevel(address)
  }

  static createFromConfig(config: ProxyLevelConfig, code: Cell, workchain = 0) {
    const data = proxyLevelConfigToCell(config)
    const init = { code, data }
    return new ProxyLevel(contractAddress(workchain, init), init)
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

  async getOwner(provider: ContractProvider) {
    const { stack } = await provider.get("owner", [])
    return stack.readAddress()
  }

  async getEnabled(provider: ContractProvider) {
    const { stack } = await provider.get("enabled", [])
    return stack.readBoolean()
  }
}
