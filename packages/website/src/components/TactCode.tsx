import { highlightTactCode } from "@/utils/highlight-tact-code"

export const TactCode = async ({ code }: { code: string }) => {
  const tactCodeHtml = await highlightTactCode(code)

  return (
    <div className="panelCode w-full">
      <div className="h-full overflow-scroll">
        <div
          className="dark"
          dangerouslySetInnerHTML={{ __html: tactCodeHtml }}
        />
      </div>
    </div>
  )
}
