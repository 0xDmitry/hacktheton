import { useState } from "react"
import { Locale } from "@/i18n.config"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table"
import { getLangDictionary } from "@/utils/lang-dictionary"

export const LeaderboardTable = ({
  playersList,
  locale,
}: {
  playersList: {
    rank: number
    name: string
    address: string
    levels: number
  }[]
  locale: Locale
}) => {
  const langDictionary = getLangDictionary(locale)

  const columnHelper = createColumnHelper<{
    rank: number
    name: string
    address: string
    levels: number
  }>()

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const table = useReactTable({
    data: playersList,
    columns: [
      columnHelper.accessor("rank", {
        header: () => (
          <span className="text-foreground">
            {langDictionary.page.leaderboard.rank}
          </span>
        ),
      }),
      columnHelper.accessor("name", {
        header: () => (
          <span className="text-foreground">
            {langDictionary.page.leaderboard.name}
          </span>
        ),
      }),
      columnHelper.accessor("address", {
        header: () => (
          <p className="text-foreground">
            {langDictionary.page.leaderboard.address}
          </p>
        ),
        cell: (info) => {
          const address = info.getValue() as string
          return (
            <span>{`${address.substring(0, 4)}...${address.substring(address.length - 4)}`}</span>
          )
        },
      }),
      columnHelper.accessor("levels", {
        header: () => (
          <span className="text-foreground">
            {langDictionary.page.leaderboard.levelsCompleted}
          </span>
        ),
      }),
    ],
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination,
    },
  })

  if (playersList.length === 0) {
    return (
      <div className="grow text-center">
        {langDictionary.page.leaderboard.noTableResults}
      </div>
    )
  }

  return (
    <div className="grow mb-9 bg-backgroundLight border border-backgroundDark overflow-x-scroll">
      <table className="w-full text-white divide-y divide-backgroundDark border-b border-backgroundDark">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} className="p-3 text-left">
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-backgroundDark">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-3 py-2">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between py-2 px-4 sm:px-10">
        <div className="flex gap-6">
          <div className="flex gap-3 text-xl">
            <button
              className="disabled:text-backgroundDark hover:opacity-70 disabled:hover:opacity-100"
              onClick={() => table.firstPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<<"}
            </button>
            <button
              className="disabled:text-backgroundDark hover:opacity-70 disabled:hover:opacity-100"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {"<"}
            </button>
            <button
              className="disabled:text-backgroundDark hover:opacity-70 disabled:hover:opacity-100"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {">"}
            </button>
            <button
              className="disabled:text-backgroundDark hover:opacity-70 disabled:hover:opacity-100"
              onClick={() => table.lastPage()}
              disabled={!table.getCanNextPage()}
            >
              {">>"}
            </button>
          </div>

          <div className="flex gap-2 items-center">
            <p className="hidden sm:block">
              {langDictionary.page.leaderboard.page}
            </p>
            <p>
              {table.getState().pagination.pageIndex + 1}{" "}
              {langDictionary.page.leaderboard.of}{" "}
              {table.getPageCount().toLocaleString()}
            </p>
          </div>
        </div>
        <div>
          <select
            className="bg-background p-2 focus:outline-none cursor-pointer border-r-8 border-background hover:bg-foreground hover:border-foreground hover:text-background"
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value))
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {langDictionary.page.leaderboard.show} {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
