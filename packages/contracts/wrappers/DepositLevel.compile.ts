import { CompilerConfig } from "@ton/blueprint"

export const compile: CompilerConfig = {
  lang: "tact",
  target: "contracts/levels/deposit_level.tact",
  options: {
    debug: true,
  },
}
