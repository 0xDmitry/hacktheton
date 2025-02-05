import { CompilerConfig } from "@ton/blueprint"

export const compile: CompilerConfig = {
  lang: "tact",
  target: "contracts/factories/tolk_level_factory.tact",
  options: {
    debug: true,
  },
}
