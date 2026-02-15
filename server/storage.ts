import { type User, type InsertUser, type GameResult } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserStats(id: number, result: GameResult): Promise<User>;
  upgradeUser(id: number): Promise<User>;
  getLeaderboard(): Promise<User[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.currentId = 1;
    // Add some mock users for leaderboard
    this.createUser({ username: "CoderOne" }).then(u => {
      this.users.set(u.id, { ...u, xp: 1200, level: 7, coins: 450, isPro: true });
    });
    this.createUser({ username: "ByteMaster" }).then(u => {
      this.users.set(u.id, { ...u, xp: 850, level: 5, coins: 200 });
    });
    this.createUser({ username: "Striver" }).then(u => {
      this.users.set(u.id, { ...u, xp: 2100, level: 11, coins: 1000, isPro: true });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      xp: 0, 
      coins: 0, 
      level: 1, 
      isPro: false 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserStats(id: number, result: GameResult): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");

    const newXp = user.xp + result.xpEarned;
    const newCoins = user.coins + result.coinsEarned;
    const newLevel = Math.floor(newXp / 200) + 1;

    const updatedUser = {
      ...user,
      xp: newXp,
      coins: newCoins,
      level: newLevel,
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async upgradeUser(id: number): Promise<User> {
    const user = this.users.get(id);
    if (!user) throw new Error("User not found");
    const updatedUser = { ...user, isPro: true };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getLeaderboard(): Promise<User[]> {
    return Array.from(this.users.values()).sort((a, b) => b.xp - a.xp);
  }
}

export const storage = new MemStorage();
