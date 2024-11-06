import { config } from "dotenv"
import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"

config({ path: ".env" })

// check if production or development if production use DATABASE_URL else use DATABASE_URL_DEV
const DATABASE_URL =
  process.env.NODE_ENV === "production"
    ? process.env.DATABASE_URL
    : process.env.DATABASE_URL_LOCAL

const client = postgres(DATABASE_URL!)

export const db = drizzle({ client })
