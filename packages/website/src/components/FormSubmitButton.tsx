import { Locale } from "@/i18n.config"
import { getLangDictionary } from "@/utils/lang-dictionary"
import { useFormStatus } from "react-dom"

export const FormSubmitButton = ({ locale }: { locale: Locale }) => {
  const langDictionary = getLangDictionary(locale)

  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-72 py-2 px-3 mb-3 bg-foreground text-black hover:enabled:bg-black hover:enabled:text-foreground disabled:bg-black disabled:text-foreground"
    >
      {pending ? langDictionary.submitting : langDictionary.submit}
    </button>
  )
}
