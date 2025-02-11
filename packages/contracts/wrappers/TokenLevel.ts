import {
  Address,
  beginCell,
  Cell,
  Contract,
  contractAddress,
  ContractProvider,
  Sender,
  SendMode,
  TupleBuilder,
} from "@ton/core"

export type TokenLevelConfig = {
  player: Address
  nonce: bigint
  owner: Address
  balances?: Cell
  totalSupply: bigint
}

export function tokenLevelConfigToCell(config: TokenLevelConfig): Cell {
  return beginCell()
    .storeAddress(config.player)
    .storeUint(config.nonce, 32)
    .storeAddress(config.owner)
    .storeMaybeRef(config.balances)
    .storeUint(config.totalSupply, 256)
    .endCell()
}

export class TokenLevel implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFromAddress(address: Address) {
    return new TokenLevel(address)
  }

  static createFromConfig(config: TokenLevelConfig, code: Cell, workchain = 0) {
    const data = tokenLevelConfigToCell(config)
    const init = { code, data }
    return new TokenLevel(contractAddress(workchain, init), init)
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

  async getBalanceOf(provider: ContractProvider, account: Address) {
    let builder = new TupleBuilder()
    builder.writeAddress(account)
    const { stack } = await provider.get("balanceOf", builder.build())
    return stack.readBigNumber()
  }

  async getTotalSupply(provider: ContractProvider) {
    const { stack } = await provider.get("totalSupply", [])
    return stack.readBigNumber()
  }
}
