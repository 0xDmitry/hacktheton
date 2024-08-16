import Link from "next/link"

const LevelItem = ({
  id,
  isCompleted,
}: {
  id: string
  isCompleted?: boolean
}) => (
  <Link
    href={`/level-${id}`}
    className="flex justify-between p-2 border-b-2 last:border-b-0 border-black hover:bg-black hover:text-foreground transition"
  >
    <div className="col-span-5">{`Level ${id}`}</div>
    <div className="">{isCompleted ? "COMPLETED" : ""}</div>
  </Link>
)

export const LevelsList = () => (
  <div className="flex justify-center">
    <div className="flex flex-col flex-grow max-w-2xl text-xl border-black bg-foreground text-black box-content">
      <LevelItem id="0" isCompleted />
      <LevelItem id="1" isCompleted />
      <LevelItem id="2" isCompleted />
      <LevelItem id="3" />
      <LevelItem id="4" />
      <LevelItem id="5" />
    </div>
  </div>
)
