import { CompilerConfig } from "@ton/blueprint"

export const compile: CompilerConfig = {
  lang: "tact",
  target: "contracts/reward_sbt.tact",
  options: {
    debug: true,
  },
}
