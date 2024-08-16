import { Levels } from "@/components/Levels"
import { TypewriterText } from "@/components/TypewriterText"
import { Welcome } from "@/components/Welcome"

export default function Home() {
  return (
    <div className="bg-background">
      <div className="container mx-auto flex flex-col items-center justify-center gap-10 p-6">
        <Welcome />
        <Levels />
        <TypewriterText text={"MORE LEVELS COMING SOON!"} />
      </div>
    </div>
  )
}
