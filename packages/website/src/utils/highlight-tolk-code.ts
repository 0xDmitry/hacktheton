import { getHighlighter, setCDN } from "shiki"
import grammar from "./grammar-tolk.json"

setCDN("/shiki")

export async function highlightTolkCode(code: string) {
  const highlighter = await getHighlighter({
    theme: "github-dark",
    paths: {
      wasm: "/",
    },
    langs: [
      "javascript",
      {
        id: "tolk",
        scopeName: "source.tolk",
        grammar: grammar as any,
        path: "",
      },
    ],
  })
  return highlighter.codeToHtml(code, { lang: "tolk" })
}
