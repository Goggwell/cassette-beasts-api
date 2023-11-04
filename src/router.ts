import { initTRPC } from "@trpc/server";
import { z } from "zod";
import SuperJSON from "superjson";

import { Context } from "./context";

export const t = initTRPC.context<Context>().create({
  transformer: SuperJSON,
  errorFormatter({ shape }) {
    return shape;
  },
});

// keeping all routes here for simplicity
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
