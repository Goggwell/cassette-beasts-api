import { initTRPC } from "@trpc/server";
import { z } from "zod";

import { Context } from "./context";

export const t = initTRPC.context<Context>().create({
  errorFormatter({ shape }) {
    return shape;
  },
});

// keeping all routes here for simplicity
export const appRouter = t.router({
  getMonsters: t.procedure.query(async ({ ctx }) => {
    return await ctx.db.selectFrom("beasts").selectAll().execute();
  }),
  getMonstersOffset: t.procedure // e.g. http://localhost:${env.PORT}/api/getMonstersOffset?input={"limit":2,"offset":2}
    .input(
      z.object({
        limit: z.number(),
        offset: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      return await ctx.db
        .selectFrom("beasts")
        .selectAll()
        .limit(input.limit)
        .offset(input.offset)
        .execute();
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
  getMonsterByName: t.procedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return await ctx.db
        .selectFrom("beasts")
        .selectAll()
        .where("name", "=", input)
        .executeTakeFirstOrThrow();
    }),
  filterMonstersByType: t.procedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return await ctx.db
        .selectFrom("beasts")
        .selectAll()
        .where("type", "=", input)
        .execute();
    }),
});

export type AppRouter = typeof appRouter;
