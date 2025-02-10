import {
  Address,
  Contract,
  fromNano,
  OpenedContract,
  Sender,
  toNano,
  beginCell,
  Builder,
} from "@ton/core"

declare global {
  interface Window {
    help: () => void
    player?: Sender
    contract?: OpenedContract<Contract>
    toNano: (src: number | string | bigint) => bigint
    fromNano: (src: bigint | number | string) => string
    Address: typeof Address
    beginCell: () => Builder
  }
}

export function setupConsoleUtils() {
  window.toNano = toNano
  window.fromNano = fromNano
  window.Address = Address
  window.beginCell = beginCell

  window.help = function () {
    console.table({
      "player: Sender": {
        description: "current player (if wallet connected)",
      },
      "player.send({value: bigint, to: Address, body?: Maybe<Cell>, sendMode?: Maybe<SendMode>, bounce?: Maybe<boolean>, init?: Maybe<StateInit>})":
        {
          description: "send custom transaction to arbitrary address",
        },
      "contract: Contract": {
        description: "current level contract instance (if created)",
      },
      "contract.send(via: Sender, args: { value: bigint, bounce?: boolean | null | undefined }, message: null | string | Message)":
        {
          description:
            "send transaction to the current level contract (Tact levels)",
        },
      "contract.send(via: Sender, body: Cell, value: bigint)": {
        description:
          "send transaction to the current level contract (Func/Tolk levels)",
      },
      "toNano(ton: number | string | bigint): bigint": {
        description: "convert ton units to nano",
      },
      "fromNano(nano: number | string | bigint): string": {
        description: "convert nano units to ton",
      },
      "Address.parse(address: string): Address": {
        description: "parse Address from string",
      },
      "beginCell(): Builder": { description: "start building a cell" },
    })
  }
}
