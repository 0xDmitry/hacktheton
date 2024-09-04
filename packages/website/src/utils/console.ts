import {
  Address,
  Contract,
  fromNano,
  OpenedContract,
  Sender,
  toNano,
} from "@ton/core"

declare global {
  interface Window {
    help: () => void
    player?: Sender
    contract?: OpenedContract<Contract>
    toNano: (src: number | string | bigint) => bigint
    fromNano: (src: bigint | number | string) => string
    parseAddress: (address: string) => Address
  }
}

export function setupConsoleUtils() {
  window.toNano = toNano
  window.fromNano = fromNano
  window.parseAddress = Address.parse

  window.help = function () {
    console.table({
      player: "current player (if wallet connected)",
      contract: "current level contract instance (if created)",
      "toNano(ton)": "convert ton units to nano",
      "fromNano(nano)": "convert nano units to ton",
      "parseAddress(addressString)": "parse Address from string",
    })
  }
}
