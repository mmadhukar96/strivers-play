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
  rank: text("rank").notNull().default("Bronze"),
});

export const RANKS = [
  { name: "Bronze", minXp: 0, color: "from-orange-700 to-orange-500", glow: "" },
  { name: "Silver", minXp: 500, color: "from-slate-400 to-slate-200", glow: "shadow-[0_0_10px_rgba(226,232,240,0.5)]" },
  { name: "Gold", minXp: 1500, color: "from-yellow-600 to-yellow-400", glow: "shadow-[0_0_15px_rgba(234,179,8,0.5)]" },
  { name: "Platinum", minXp: 3000, color: "from-cyan-500 to-blue-400", glow: "shadow-[0_0_20px_rgba(34,211,238,0.6)]" },
  { name: "Diamond", minXp: 6000, color: "from-purple-600 to-pink-500", glow: "shadow-[0_0_25px_rgba(168,85,247,0.7)]" },
];

export function calculateRank(xp: number): string {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].minXp) {
      return RANKS[i].name;
    }
  }
  return "Bronze";
}

export function getRankProgress(xp: number) {
  const currentRankIndex = RANKS.findIndex(r => xp < (RANKS[RANKS.indexOf(r) + 1]?.minXp ?? Infinity)) ;
  const nextRank = RANKS[currentRankIndex + 1];
  
  if (!nextRank) return null;
  
  return {
    nextRank: nextRank.name,
    xpNeeded: nextRank.minXp - xp,
    progress: ((xp - RANKS[currentRankIndex].minXp) / (nextRank.minXp - RANKS[currentRankIndex].minXp)) * 100
  };
}

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
