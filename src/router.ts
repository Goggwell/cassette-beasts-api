import { initTRPC } from "@trpc/server";
import { z } from "zod";

import { Context } from "./context";

export const t = initTRPC.context<Context>().create();

export const appRouter = t.router({
  getMonsters: t.procedure.query(async ({ ctx }) => {
    return await ctx.db.selectFrom("beasts").selectAll().execute();
  }),
  getMonsterById: t.procedure
    .input(z.number())
    .query(async ({ input, ctx }) => {
      return await ctx.db
        .selectFrom("beasts")
        .selectAll()
        .where("id", "=", input)
        .executeTakeFirstOrThrow();
    }),
});

export type AppRouter = typeof appRouter;
