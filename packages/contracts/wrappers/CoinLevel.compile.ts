import { CompilerConfig } from "@ton/blueprint"

export const compile: CompilerConfig = {
  lang: "tact",
  target: "contracts/levels/coin_level.tact",
  options: {
    debug: true,
  },
}
