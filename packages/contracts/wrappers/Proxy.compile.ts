import { CompilerConfig } from "@ton/blueprint"

export const compile: CompilerConfig = {
  lang: "tact",
  target: "contracts/proxy.tact",
  options: {
    debug: true,
  },
}
