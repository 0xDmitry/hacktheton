import { getHighlighter, setCDN } from "shiki"
import grammar from "./grammar-func.json"

setCDN("/shiki")

export async function highlightFuncCode(code: string) {
  const highlighter = await getHighlighter({
    theme: "github-dark",
    paths: {
      wasm: "/",
    },
    langs: [
      "javascript",
      {
        id: "func",
        scopeName: "source.func",
        grammar: grammar as any,
        path: "",
      },
    ],
  })
  return highlighter.codeToHtml(code, { lang: "func" })
}
