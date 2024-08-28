import { Contract, fromNano, OpenedContract, Sender, toNano } from "@ton/core"

declare global {
  interface Window {
    help: () => void
    player?: Sender
    contract?: OpenedContract<Contract>
    toNano: (src: number | string | bigint) => bigint
    fromNano: (src: bigint | number | string) => string
  }
}

export function setupConsoleUtils() {
  window.toNano = toNano
  window.fromNano = fromNano

  window.help = function () {
    console.table({
      player: "current player (if wallet connected)",
      contract: "current level contract instance (if created)",
      "toNano(ton)": "convert ton units to nano",
      "fromNano(nano)": "convert nano units to ton",
    })
  }
}
