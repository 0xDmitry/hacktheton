import { CompilerConfig } from "@ton/blueprint"

export const compile: CompilerConfig = {
  lang: "tact",
  target: "contracts/scanner_level.tact",
  options: {
    debug: true,
  },
}
