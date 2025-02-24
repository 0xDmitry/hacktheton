import { SourceLanguage } from "@/constants/levels"
import { highlightTactCode } from "@/utils/highlight-tact-code"
import { highlightFuncCode } from "@/utils/highlight-func-code"
import { highlightTolkCode } from "@/utils/highlight-tolk-code"

async function highlightCode(code: string, lang: SourceLanguage) {
  switch (lang) {
    case "tact":
      return await highlightTactCode(code)
    case "func":
      return await highlightFuncCode(code)
    case "tolk":
      return await highlightTolkCode(code)
  }
}

export const SourceCode = async ({
  code,
  lang,
}: {
  code: string
  lang: SourceLanguage
}) => {
  const codeHtml = await highlightCode(code, lang)

  return (
    <div className="w-full p-5 text-[13px] leading-[18px] bg-codePanel">
      <div className="h-full overflow-scroll">
        <div className="dark" dangerouslySetInnerHTML={{ __html: codeHtml }} />
      </div>
    </div>
  )
}
