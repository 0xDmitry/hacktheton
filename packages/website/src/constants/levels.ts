interface Level {
  name: string
  isCompleted: boolean
}

export const levels: Level[] = [
  { name: "Introduction", isCompleted: true },
  { name: "Deposit", isCompleted: true },
  { name: "Level 2", isCompleted: true },
  { name: "Level 3", isCompleted: false },
  { name: "Level 4", isCompleted: false },
  { name: "Level 5", isCompleted: false },
]
