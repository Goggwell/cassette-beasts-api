import { initTRPC } from "@trpc/server";
import { z } from "zod";

import { Context } from "./context";

export const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
  getMonsters: t.procedure.query(async ({ ctx }) => {
    return await ctx.db.selectFrom("Monster").selectAll().execute();
  }),
});

export type AppRouter = typeof appRouter;
