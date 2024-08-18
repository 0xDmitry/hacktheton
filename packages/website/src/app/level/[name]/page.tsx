import Link from "next/link"
import { ActionButtons } from "@/components/ActionButtons"
import { TactCode } from "@/components/TactCode"

export default function Level({ params }: { params: { name: string } }) {
  return (
    <div className="flex justify-center bg-background py-12 px-6">
      <div className="flex flex-col justify-center max-w-5xl border-2 border-foreground">
        <div className="flex text-xl">
          <Link
            href="/"
            className="py-4 pl-4 pr-16 bg-foreground border-b-2 border-r-2 border-foreground text-black hover:bg-black hover:text-foreground transition"
          >
            BACK
          </Link>
          <div className="flex justify-end flex-grow p-4 border-b-2 border-foreground">
            {params.name.replaceAll("-", " ").toUpperCase()}
          </div>
        </div>
        <div className="p-12 text-xl">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s with
          the release of Letraset sheets containing Lorem Ipsum passages, and
          more recently with desktop publishing software like Aldus PageMaker
          including versions of Lorem Ipsum.
        </div>
        <div className="flex justify-center p-12">
          <TactCode />
        </div>
        <ActionButtons />
      </div>
    </div>
  )
}
