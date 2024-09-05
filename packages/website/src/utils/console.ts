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
import {
  ActionConfiguration,
  SendTransactionRequest,
  SendTransactionResponse,
} from "@tonconnect/ui-react"

declare global {
  interface Window {
    help: () => void
    player?: Sender
    contract?: OpenedContract<Contract>
    toNano: (src: number | string | bigint) => bigint
    fromNano: (src: bigint | number | string) => string
    parseAddress: (address: string) => Address
    sendTransaction: (
      tx: SendTransactionRequest,
      options?: ActionConfiguration,
    ) => Promise<SendTransactionResponse>
    beginCell: () => Builder
  }
}

export function setupConsoleUtils() {
  window.toNano = toNano
  window.fromNano = fromNano
  window.parseAddress = Address.parse
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
      "parseAddress(addressString)": {
        description: "parse Address from string",
      },
      "sendTransaction(tx, options)": {
        description: "send custom transaction to arbitrary address",
      },
      "beginCell()": { description: "start building a cell" },
    })
  }
}
