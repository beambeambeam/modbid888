"use client"

import { ColumnDef } from "@tanstack/react-table"

import { DataTable } from "~/components/table/data-table"
import { useServerActionQuery } from "~/hooks/server-action-hooks"
import { ArrayElement, MinigameId } from "~/types"

import { getTop3BetAction } from "./actions"

type MinigameTableProps = {
  minigameId: MinigameId
}

function MinigameTable({ minigameId }: MinigameTableProps) {
  const { data: top3 } = useServerActionQuery(getTop3BetAction, {
    input: {
      minigameId: minigameId,
    },
    queryKey: ["key"],
  })

  if (!top3) {
    return null
  }

  const columns: ColumnDef<ArrayElement<typeof top3>>[] = [
    {
      accessorKey: "displayName",
      header: "Display Name",
      cell: ({ row }) => (
        <p className="font-alagard text-xl">
          {row.original.displayName}#{row.original.userId}
        </p>
      ),
    },
    {
      accessorKey: "betAmount",
      header: "Balance",
      cell: ({ row }) => (
        <p className="font-alagard text-xl">{row.original.betAmount}</p>
      ),
    },
    {
      accessorKey: "profit",
      cell: ({ row }) => (
        <p
          className={`font-alagard text-xl ${row.original.profit > 0 ? "text-green-500" : "text-red-500"}`}
        >
          {row.original.profit}
        </p>
      ),
    },
  ]

  return <DataTable columns={columns} data={top3} />
}
export default MinigameTable
