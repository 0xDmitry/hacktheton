import { LevelsList } from "@/components/LevelsList"
import { TypewriterText } from "@/components/TypewriterText"
import { Welcome } from "@/components/Welcome"

export default function Home() {
  return (
    <div className="container mx-auto flex flex-col justify-center gap-12 my-6 p-6">
      <Welcome />
      <LevelsList />
      <TypewriterText
        className="text-4xl text-center"
        text={"MORE LEVELS COMING SOON!"}
      />
    </div>
  )
}
