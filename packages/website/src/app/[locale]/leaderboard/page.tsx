"use client"

import Link from "next/link"
import { getLangDictionary } from "@/utils/lang-dictionary"
import { Locale } from "@/i18n.config"
import { LeftArrow } from "@/components/assets/LeftArrow"
import { TypewriterText } from "@/components/TypewriterText"
import { useTonWallet } from "@tonconnect/ui-react"
import { playersMock } from "@/playersMock"
import { useTonConnect } from "@/hooks/useTonConnect"
import { useMemo, useState } from "react"
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table"

export default function LeaderboardPage({
  params: { locale },
}: {
  params: { locale: Locale }
}) {
  const langDictionary = getLangDictionary(locale)
  const wallet = useTonWallet()
  const { sender } = useTonConnect()

  const playerAddress = useMemo(
    () => sender.address?.toString(),
    [sender.address],
  )

  const isPlayerInList = useMemo(
    () =>
      Boolean(playerAddress) &&
      playersMock.some((player) => player.address === playerAddress),
    [playerAddress],
  )

  const rankedPlayersList = useMemo(() => {
    const sortedList = playersMock.sort((a, b) => b.levels - a.levels)

    let rank = 1

    return sortedList.map((player, index, array) => {
      const result = {
        rank,
        name: player.name,
        levels: player.levels,
      }

      if (index < array.length - 1 && player.levels > array[index + 1].levels) {
        rank++
      }

      return result
    })
  }, [])

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
    data: rankedPlayersList,
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

  return (
    <div className="flex justify-center w-full md:container md:mx-auto md:py-12 md:px-6">
      <div className="flex flex-col justify-center w-full border-2 border-foreground">
        <div className="flex">
          <Link
            href={`/${locale}`}
            className="flex items-center gap-5 p-4 bg-foreground border-b-2 border-r-2 border-foreground text-black hover:bg-black hover:text-foreground [&_svg]:hover:fill-foreground transition text-xl"
          >
            <LeftArrow />
            <div>{langDictionary.back}</div>
          </Link>
          <TypewriterText
            className="flex justify-end items-center flex-grow p-4 border-b-2 border-foreground text-3xl"
            text={"LEADERBOARD"}
          />
        </div>
        <div className="h-full w-full">
          <div className="flex justify-center items-center py-6 px-4 sm:px-6 lg:px-8 xl:px-20 mx-auto">
            {!wallet && (
              <div>Connect the wallet in order to update your results</div>
            )}
            {wallet && !isPlayerInList && (
              <div className="flex flex-col gap-4">
                <div className="flex justify-center items-center">
                  Enter your nickname to be displayed in the table
                </div>
                <div className="flex items-center gap-4">
                  <input className="w-full grow outline-none bg-backgroundLight text-white py-2 px-3 outline-offset-0 focus:outline focus:outline-backgroundDark" />
                  <button className="py-2 px-3 bg-foreground text-black hover:bg-black hover:text-foreground">
                    SUBMIT
                  </button>
                </div>
              </div>
            )}
            {wallet && isPlayerInList && (
              <button className="p-3 bg-foreground text-black hover:bg-black hover:text-foreground">
                UPDATE LEADERBOARD DATA
              </button>
            )}
          </div>

          <div className="px-4 sm:px-6 lg:px-8 xl:px-20 mx-auto">
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
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
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
          </div>
        </div>
      </div>
    </div>
  )
}
