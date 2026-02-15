import { z } from 'zod';
import { insertUserSchema, users, gameResultSchema } from './schema';

export const api = {
  users: {
    login: {
      method: 'POST' as const,
      path: '/api/login' as const,
      input: z.object({ username: z.string() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
      },
    },
    me: {
      method: 'GET' as const,
      path: '/api/me' as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: z.object({ message: z.string() }),
      },
    },
    upgrade: {
      method: 'POST' as const,
      path: '/api/upgrade' as const,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
      },
    }
  },
  game: {
    complete: {
      method: 'POST' as const,
      path: '/api/game/complete' as const,
      input: gameResultSchema,
      responses: {
        200: z.custom<typeof users.$inferSelect>(), // Returns updated user
      },
    },
  },
  leaderboard: {
    list: {
      method: 'GET' as const,
      path: '/api/leaderboard' as const,
      responses: {
        200: z.array(z.custom<typeof users.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
