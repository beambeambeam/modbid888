import { ColumnDef } from "@tanstack/react-table"

import { DataTable } from "~/components/table/data-table"
import { BetLogs } from "~/db/schema"
import { MinigameId } from "~/types"

import { getTop3BetAction } from "./actions"

const columns: ColumnDef<BetLogs>[] = [
  {
    accessorKey: "userId",
  },
  {
    accessorKey: "betAmount",
  },
  {
    accessorKey: "profit",
  },
]

type MinigameTableProps = {
  minigameId: MinigameId
}

async function MinigameTable({ minigameId }: MinigameTableProps) {
  const [top3] = await getTop3BetAction({
    minigameId: minigameId,
  })

  if (!top3) {
    return null
  }

  return <DataTable columns={columns} data={top3} />
}
export default MinigameTable
