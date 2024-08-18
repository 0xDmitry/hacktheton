interface Level {
  name: string
  isCompleted: boolean
}

export const levels: Level[] = [
  { name: "introduction", isCompleted: true },
  { name: "deposit", isCompleted: true },
  { name: "level-2", isCompleted: true },
  { name: "level-3", isCompleted: false },
  { name: "level-4", isCompleted: false },
  { name: "level-5", isCompleted: false },
]
