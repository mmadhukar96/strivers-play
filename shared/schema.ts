import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  xp: integer("xp").notNull().default(0),
  coins: integer("coins").notNull().default(0),
  level: integer("level").notNull().default(1),
  isPro: boolean("is_pro").notNull().default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export const gameResultSchema = z.object({
  won: z.boolean(),
  xpEarned: z.number(),
  coinsEarned: z.number(),
});
export type GameResult = z.infer<typeof gameResultSchema>;
