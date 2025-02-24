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

export type JackpotLevelConfig = {
  player: Address
  nonce: bigint
  balances?: Cell
}

export function jackpotLevelConfigToCell(config: JackpotLevelConfig): Cell {
  return beginCell()
    .storeAddress(config.player)
    .storeUint(config.nonce, 32)
    .storeMaybeRef(config.balances)
    .endCell()
}

export class JackpotLevel implements Contract {
  constructor(
    readonly address: Address,
    readonly init?: { code: Cell; data: Cell },
  ) {}

  static createFromAddress(address: Address) {
    return new JackpotLevel(address)
  }

  static createFromConfig(
    config: JackpotLevelConfig,
    code: Cell,
    workchain = 0,
  ) {
    const data = jackpotLevelConfigToCell(config)
    const init = { code, data }
    return new JackpotLevel(contractAddress(workchain, init), init)
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

  async getBalanceOf(provider: ContractProvider, account: Address) {
    let builder = new TupleBuilder()
    builder.writeAddress(account)
    const { stack } = await provider.get("balance_of", builder.build())
    return stack.readBigNumber()
  }

  async getBalance(provider: ContractProvider) {
    const { stack } = await provider.get("balance", [])
    return stack.readBigNumber()
  }
}
