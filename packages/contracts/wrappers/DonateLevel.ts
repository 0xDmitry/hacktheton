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

export type DonateLevelConfig = {
  player: Address
  nonce: bigint
  owner: Address
  destination: Address
  donationsCount: bigint
}

export function donateLevelConfigToCell(config: DonateLevelConfig): Cell {
  return beginCell()
    .storeAddress(config.player)
    .storeUint(config.nonce, 32)
    .storeAddress(config.owner)
    .storeAddress(config.destination)
    .storeUint(config.donationsCount, 32)
    .endCell()
}

export class DonateLevel implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFromAddress(address: Address) {
    return new DonateLevel(address)
  }

  static createFromConfig(
    config: DonateLevelConfig,
    code: Cell,
    workchain = 0,
  ) {
    const data = donateLevelConfigToCell(config)
    const init = { code, data }
    return new DonateLevel(contractAddress(workchain, init), init)
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
    const { stack } = await provider.get("_owner", [])
    return stack.readAddress()
  }

  async getDestination(provider: ContractProvider) {
    const { stack } = await provider.get("_destination", [])
    return stack.readAddress()
  }

  async getDonationsCount(provider: ContractProvider) {
    const { stack } = await provider.get("_donations_count", [])
    return stack.readBigNumber()
  }

  async getBalance(provider: ContractProvider) {
    const { stack } = await provider.get("balance", [])
    return stack.readBigNumber()
  }
}
