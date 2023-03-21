import { createTRPCRouter } from "~/server/api/trpc";
import { questRouter } from "~/server/api/routers/quest";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  quest: questRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
