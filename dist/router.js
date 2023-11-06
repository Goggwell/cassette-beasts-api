"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/router.ts
var router_exports = {};
__export(router_exports, {
  appRouter: () => appRouter,
  t: () => t
});
module.exports = __toCommonJS(router_exports);
var import_server = require("@trpc/server");
var import_zod = require("zod");
var t = import_server.initTRPC.context().create({
  errorFormatter({ shape }) {
    return shape;
  }
});
var appRouter = t.router({
  getMonsters: t.procedure.query(async ({ ctx }) => {
    return await ctx.db.selectFrom("beasts").selectAll().execute();
  }),
  getMonstersOffset: t.procedure.input(
    import_zod.z.object({
      limit: import_zod.z.number(),
      offset: import_zod.z.number()
    })
  ).query(async ({ input, ctx }) => {
    return await ctx.db.selectFrom("beasts").selectAll().limit(input.limit).offset(input.offset).execute();
  }),
  getMonsterById: t.procedure.input(import_zod.z.number()).query(async ({ input, ctx }) => {
    return await ctx.db.selectFrom("beasts").selectAll().where("id", "=", input).executeTakeFirstOrThrow();
  }),
  getMonsterByName: t.procedure.input(import_zod.z.string()).query(async ({ input, ctx }) => {
    return await ctx.db.selectFrom("beasts").selectAll().where("name", "=", input).executeTakeFirstOrThrow();
  }),
  filterMonstersByType: t.procedure.input(import_zod.z.string()).query(async ({ input, ctx }) => {
    return await ctx.db.selectFrom("beasts").selectAll().where("type", "=", input).execute();
  })
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  appRouter,
  t
});
