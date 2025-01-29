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
import { TonConnectUI } from "@tonconnect/ui-react"

declare global {
  interface Window {
    help: () => void
    player?: Sender
    contract?: OpenedContract<Contract>
    toNano: (src: number | string | bigint) => bigint
    fromNano: (src: bigint | number | string) => string
    Address: typeof Address
    tonConnectUI: TonConnectUI
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
      player: {
        description: "current player (if wallet connected)",
      },
      contract: {
        description: "current level contract instance (if created)",
      },
      "contract.send(from: Address, args: { value: bigint, bounce?: boolean | null | undefined }, message: null | string | Message)":
        { description: "send transaction to the current level contract" },
      "toNano(ton: number | string | bigint): bigint": {
        description: "convert ton units to nano",
      },
      "fromNano(nano: number | string | bigint): string": {
        description: "convert nano units to ton",
      },
      "Address.parse(address: string): Address": {
        description: "parse Address from string",
      },
      "tonConnectUI.sendTransaction(tx: SendTransactionRequest, options?: ActionConfiguration)":
        {
          description:
            "send custom transaction to arbitrary address, for details visit https://www.npmjs.com/package/@tonconnect/ui",
        },
      "beginCell(): Builder": { description: "start building a cell" },
    })
  }
}
