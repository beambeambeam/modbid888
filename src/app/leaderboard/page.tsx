"use client"

import { ColumnDef } from "@tanstack/react-table"

import { DataTable } from "~/components/table/data-table"
import { Profiles } from "~/db/schema"
import { useServerActionQuery } from "~/hooks/server-action-hooks"

import { getLeaderboardAction } from "./action"

const columns: ColumnDef<Profiles>[] = [
  {
    accessorKey: "displayName",
    header: "display name",
    cell: ({ row }) => (
      <p>
        {row.original.displayName}#{row.original.id}
      </p>
    ),
  },
  {
    accessorKey: "balance",
    header: "balance",
  },
]

function LeaderboardPage() {
  const { data } = useServerActionQuery(getLeaderboardAction, {
    input: undefined,
    queryKey: ["leaderboard"],
  })

  if (!data) {
    return <p>loading...</p>
  }

  return (
    <div>
      <h1>Leaderboard</h1>
      <DataTable columns={columns} data={data} />
    </div>
  )
}
export default LeaderboardPage
