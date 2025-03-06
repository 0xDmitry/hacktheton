import Link from "next/link"
import { Locale } from "@/i18n.config"
import { LeftArrow } from "@/components/assets/LeftArrow"
import { TypewriterText } from "@/components/TypewriterText"
import { getLangDictionary } from "@/utils/lang-dictionary"

export default function LevelApplicationPage({
  params: { locale },
}: {
  params: { locale: Locale }
}) {
  const langDictionary = getLangDictionary(locale)

  return (
    <div className="flex justify-center w-full md:container md:mx-auto md:py-12 md:px-6">
      <div className="flex flex-col justify-center w-full border-2 border-foreground">
        <div className="flex text-xl">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-5 p-4 bg-foreground border-b-2 border-r-2 border-foreground text-black hover:bg-black hover:text-foreground [&_svg]:hover:fill-foreground transition"
          >
            <LeftArrow />
            <div>{langDictionary.back}</div>
          </Link>
          <TypewriterText
            className="flex justify-end items-center flex-grow p-4 border-b-2 border-foreground"
            text={langDictionary.page.levelApplication.levelApplication}
          />
        </div>

        <form className="flex flex-col gap-4 p-6 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <div>
              <label htmlFor="name" className="mb-2 block">
                {`${langDictionary.page.levelApplication.name} *`}
              </label>
              <input
                id="name"
                name="name"
                className="w-full outline-none bg-backgroundLight text-white py-2 px-3 outline-offset-0 focus:outline focus:outline-backgroundDark"
              />
            </div>

            <div>
              <label htmlFor="telegramUsername" className="mb-2 block">
                {`${langDictionary.page.levelApplication.telegramUsername} *`}
              </label>
              <input
                id="telegramUsername"
                name="telegramUsername"
                className="w-full outline-none bg-backgroundLight text-white py-2 px-3 outline-offset-0 focus:outline focus:outline-backgroundDark"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <label htmlFor="levelName" className="mb-2 block">
                {langDictionary.page.levelApplication.levelName}
              </label>
              <input
                id="levelName"
                name="levelName"
                className="w-full outline-none bg-backgroundLight text-white py-2 px-3 outline-offset-0 focus:outline focus:outline-backgroundDark"
              />
            </div>
          </div>

          <div className="flex w-full flex-col">
            <label htmlFor="goalAndHints" className="mb-2 block">
              {langDictionary.page.levelApplication.goalAndHints}
            </label>
            <textarea
              id="goalAndHints"
              name="goalAndHints"
              className="size-full min-h-[200px] outline-none bg-backgroundLight text-white py-2 px-3 outline-offset-0 focus:outline focus:outline-backgroundDark"
            ></textarea>
          </div>

          <div className="flex w-full flex-col">
            <label htmlFor="contract" className="mb-2 block">
              {langDictionary.page.levelApplication.smartContractCode}
            </label>
            <textarea
              id="contract"
              name="contract"
              className="size-full min-h-[500px] outline-none bg-backgroundLight text-white py-2 px-3 outline-offset-0 focus:outline focus:outline-backgroundDark"
              placeholder={
                langDictionary.page.levelApplication.smartContractOrIdea
              }
            ></textarea>
          </div>

          <div className="flex w-full flex-col">
            <label htmlFor="solution" className="mb-2 block">
              {langDictionary.page.levelApplication.solution}
            </label>
            <textarea
              id="solution"
              name="solution"
              className="size-full min-h-[200px] outline-none bg-backgroundLight text-white py-2 px-3 outline-offset-0 focus:outline focus:outline-backgroundDark"
            ></textarea>
          </div>
          <div className="flex justify-center mt-6">
            <button className="w-[250px] py-2 px-3 bg-foreground text-black hover:bg-black hover:text-foreground">
              {langDictionary.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
