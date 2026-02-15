import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Mock Session Middleware
  // In a real app, use express-session or proper auth
  let mockSessionUserId: number | null = null;

  app.post(api.users.login.path, async (req, res) => {
    const { username } = req.body;
    let user = await storage.getUserByUsername(username);
    if (!user) {
      user = await storage.createUser({ username });
    }
    mockSessionUserId = user.id;
    res.json(user);
  });

  app.get(api.users.me.path, async (req, res) => {
    if (!mockSessionUserId) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = await storage.getUser(mockSessionUserId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    res.json(user);
  });

  app.post(api.game.complete.path, async (req, res) => {
    if (!mockSessionUserId) return res.sendStatus(401);
    const result = api.game.complete.input.parse(req.body);
    const updatedUser = await storage.updateUserStats(mockSessionUserId, result);
    res.json(updatedUser);
  });

  app.get(api.leaderboard.list.path, async (req, res) => {
    const users = await storage.getLeaderboard();
    res.json(users);
  });

  app.post(api.users.upgrade.path, async (req, res) => {
    if (!mockSessionUserId) return res.sendStatus(401);
    const updatedUser = await storage.upgradeUser(mockSessionUserId);
    res.json(updatedUser);
  });

  return httpServer;
}
