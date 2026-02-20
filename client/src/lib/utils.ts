import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const RANKS = [
  { name: "Bronze", minXp: 0, color: "from-orange-700 to-orange-500", glow: "" },
  { name: "Silver", minXp: 500, color: "from-slate-400 to-slate-200", glow: "shadow-[0_0_10px_rgba(226,232,240,0.5)]" },
  { name: "Gold", minXp: 1500, color: "from-yellow-600 to-yellow-400", glow: "shadow-[0_0_15px_rgba(234,179,8,0.5)]" },
  { name: "Platinum", minXp: 3000, color: "from-cyan-500 to-blue-400", glow: "shadow-[0_0_20px_rgba(34,211,238,0.6)]" },
  { name: "Diamond", minXp: 6000, color: "from-purple-600 to-pink-500", glow: "shadow-[0_0_25px_rgba(168,85,247,0.7)]" },
];
