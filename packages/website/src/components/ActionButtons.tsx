"use client"

import { useTonConnectModal, useTonWallet } from "@tonconnect/ui-react"

export const ActionButtons = () => {
  const wallet = useTonWallet()
  const { open } = useTonConnectModal()

  if (wallet) {
    return (
      <div className="grid grid-cols-2 text-xl">
        <button className="flex flex-grow justify-center p-4 bg-foreground border-t-2 border-r-2 border-foreground text-black hover:bg-black hover:text-foreground transition">
          CHECK SOLUTION
        </button>
        <button className="flex flex-grow justify-center p-4 bg-foreground border-t-2 border-foreground text-black hover:bg-black hover:text-foreground transition">
          GET NEW INSTANCE
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={open}
      className="flex flex-grow justify-center p-4 bg-foreground border-t-2 border-foreground text-black hover:bg-black hover:text-foreground transition"
    >
      CONNECT WALLET
    </button>
  )
}
