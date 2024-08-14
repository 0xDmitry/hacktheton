export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-5xl text-center bg-background">
      <div>TON BASED WARGAME</div>
      <div className="flex">
        <div className="relative w-[max-content] before:absolute before:inset-0 before:bg-background before:animate-typewriter after:absolute after:inset-0 after:w-[0.6em] after:animate-cursor after:bg-foreground">
          COMING SOON
        </div>
        {/* The cursor doesn't take space so we need this hack */}
        <div className="bg-transparent w-[0.6em]"></div>
      </div>
    </div>
  )
}
