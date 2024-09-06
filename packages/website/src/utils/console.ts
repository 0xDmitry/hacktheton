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
      "toNano(ton)": {
        description: "convert ton units to nano",
      },
      "fromNano(nano)": {
        description: "convert nano units to ton",
      },
      "Address.parse(addressString)": {
        description: "parse Address from string",
      },
      "tonConnectUI.sendTransaction(tx, options)": {
        description: "send custom transaction to arbitrary address",
      },
      "beginCell()": { description: "start building a cell" },
    })
  }
}
