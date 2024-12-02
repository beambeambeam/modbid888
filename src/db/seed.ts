import "dotenv/config"

import { MINIGAME_DEFAULT } from "~/db/default"
import { database, pg } from "~/db/index"
import { accounts, minigames, profiles, users } from "~/db/schema"

async function main() {
  await database.insert(minigames).values(MINIGAME_DEFAULT)
  await database.insert(users).values({
    id: 1,
    email: "test@test.com",
  })
  await database.insert(accounts).values({
    password:
      "60dcd5de2469f4a8bcafcb8a98b2df3d082d51b7b2b592a12664e42f929af733c0720ffd3a2cd05c222fe482160c4649c418d0d14c4261eaf231b079c4e5a7ec",
    salt: "pBZfkWuTl+0ZjXOuepSkjT3YNEURKeUJIrxdQtBJFOmpgb/9dPsRydaanhPOOqebOswyXrhIQzT8rCTCwRqQ/vBvQFE8XFj0AL49i/jrvV6yEnuQCyqjndkeX6nSktlyD4gDwkqvC8yz7dIv/d93ARwQP0nxdMBB9YsP3DVwbQY=",
    userId: 1,
    id: 1,
  })
  await database.insert(profiles).values({
    id: 1,
    userId: 1,
    balance: 1_000_000,
    role: "member",
    displayName: "dummy",
  })

  await pg.end()
}

main()