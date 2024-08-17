import { LevelsList } from "@/components/LevelsList"
import { TypewriterText } from "@/components/TypewriterText"
import { Welcome } from "@/components/Welcome"

export default function Home() {
  return (
    <div className="bg-background">
      <div className="container mx-auto flex flex-col justify-center gap-12 px-6 py-12">
        <Welcome />
        <LevelsList />
        <TypewriterText text={"MORE LEVELS COMING SOON!"} />
      </div>
    </div>
  )
}
