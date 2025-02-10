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

export const LeaderboardTable = ({
  playersList,
  locale,
}: {
  playersList: {
    rank: number
    name: string
    levels: number
  }[]
  locale: Locale
}) => {
  const columnHelper = createColumnHelper<{
    rank: number
    name: string
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
          <span className="text-foreground tracking-wide">RANK</span>
        ),
      }),
      columnHelper.accessor("name", {
        header: () => (
          <span className="text-foreground tracking-wide">NAME</span>
        ),
      }),
      columnHelper.accessor("levels", {
        header: () => (
          <span className="text-foreground tracking-wide">
            LEVELS COMPLETED
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
      <div className="flex justify-center items-center">
        Nobody has added their results to the table yet
      </div>
    )
  }

  return (
    <div className="bg-backgroundLight border border-backgroundDark mb-9">
      <table className="text-white divide-y divide-backgroundDark w-full border-b border-backgroundDark">
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
      <div className="flex p-2 items-center justify-around">
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
            <p>Page</p>
            <p>
              {table.getState().pagination.pageIndex + 1} of{" "}
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
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
