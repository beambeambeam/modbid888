import { relations } from "drizzle-orm"
import {
  index,
  numeric,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core"

export const roleEnum = pgEnum("role", ["member", "admin"])

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique(),
})

export const accounts = pgTable(
  "accounts",
  {
    id: serial("id").primaryKey(),
    userId: serial("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    password: text("password").notNull(),
    salt: text("salt").notNull(),
  },
  (table) => [index("user_id_account_type_idx").on(table.userId)]
)

export const profiles = pgTable(
  "profiles",
  {
    id: serial("id").primaryKey(),
    userId: serial("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
      })
      .unique(),
    displayName: text("display_name").notNull(),
    role: roleEnum("role").notNull().default("member"),
  },
  (table) => [
    index("user_id_profile_type_idx").on(table.userId),
    index("role_idx").on(table.role),
  ]
)

export const userLogs = pgTable(
  "userlogs",
  {
    id: serial("id").primaryKey(),
    userId: serial("user_id").references(() => users.id, {
      onDelete: "cascade",
    }),
    action: text("action").notNull(),
    timestamp: timestamp("timestamp").notNull(),
  },
  (table) => [index("user_id_log_type_idx").on(table.userId)]
)

export const betLogs = pgTable("betlogs", {
  id: serial("id").primaryKey(),
  userId: serial("user_id").references(() => users.id, {
    onDelete: "cascade",
  }),
  timestamp: timestamp("timestamp").notNull(),
  minigamesId: serial("minigames_id").references(() => minigames.id, {
    onDelete: "cascade",
  }),
  betAmount: text("bet_amount").notNull(),
  betResult: text("bet_result").notNull(),
  profit: text("profit").notNull(),
  multiplier: text("multiplier").notNull(),
})

export const minigames = pgTable("minigames", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  winMultiplier: numeric("win_multiplier").notNull(),
  lossMultiplier: numeric("loss_multiplier").notNull(),
})

export const sessions = pgTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: serial("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
  },
  (table) => [index("sessions_user_id_idx").on(table.userId)]
)

export const userLogsRelations = relations(userLogs, ({ one }) => ({
  user: one(users, {
    fields: [userLogs.userId],
    references: [users.id],
  }),
}))

export const betLogsRelations = relations(betLogs, ({ one }) => ({
  user: one(users, {
    fields: [betLogs.userId],
    references: [users.id],
  }),
  minigame: one(minigames, {
    fields: [betLogs.minigamesId],
    references: [minigames.id],
  }),
}))

export type Users = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
export type Accounts = typeof accounts.$inferSelect
export type NewAccount = typeof accounts.$inferInsert
export type Profiles = typeof profiles.$inferSelect
export type NewProfile = typeof profiles.$inferInsert
export type UserLogs = typeof userLogs.$inferSelect
export type NewUserLog = typeof userLogs.$inferInsert
export type Session = typeof sessions.$inferSelect
export type NewSession = typeof sessions.$inferInsert
export type BetLogs = typeof betLogs.$inferSelect
export type NewBetLog = typeof betLogs.$inferInsert
