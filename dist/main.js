"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/main.ts
var import_fastify = __toESM(require("fastify"));
var import_sensible = __toESM(require("@fastify/sensible"));
var import_cors = __toESM(require("@fastify/cors"));
var import_helmet = __toESM(require("@fastify/helmet"));
var import_fastify2 = require("@trpc/server/adapters/fastify");

// src/router.ts
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

// src/db/index.ts
var import_kysely = require("kysely");
var import_kysely_neon = require("kysely-neon");
var import_ws = __toESM(require("ws"));
var db = new import_kysely.Kysely({
  dialect: new import_kysely_neon.NeonDialect({
    connectionString: process.env.DATABASE_URL,
    webSocketConstructor: import_ws.default
  })
});

// src/context.ts
var createContext = ({ req, res }) => {
  return {
    req,
    res,
    db
  };
};

// src/config/config.ts
var config = {
  development: {
    logger: {
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "yyyy-mm-dd HH:MM:ss:l"
        }
      },
      level: "debug"
    }
  },
  production: {
    logger: {
      serializers: {
        req(req) {
          return {
            method: req.method,
            url: req.url
          };
        }
      },
      level: "info",
      transport: {
        targets: [
          {
            target: "pino/file",
            level: "info",
            options: {
              destination: `./logs/production.log`,
              mkdir: true
            }
          }
        ]
      }
    }
  },
  testing: { logger: false }
};

// src/config/env.ts
var import_zod2 = require("zod");
var envSchema = import_zod2.z.object({
  PORT: import_zod2.z.coerce.number().int().default(3333),
  NODE_ENV: import_zod2.z.string().default("development"),
  HOST: import_zod2.z.string().default("localhost")
});
var env = envSchema.parse(process.env);

// src/main.ts
(async () => {
  try {
    const server = await (0, import_fastify.default)({
      maxParamLength: 5e3,
      logger: config[env.NODE_ENV].logger
    });
    await server.register(import_sensible.default);
    await server.register(import_fastify2.fastifyTRPCPlugin, {
      prefix: "/api",
      trpcOptions: {
        router: appRouter,
        createContext
      }
    });
    await server.register(import_cors.default, {
      origin: "*",
      credentials: true
    });
    await server.register(import_helmet.default);
    if (env.HOST) {
      await server.listen({
        port: env.PORT,
        host: env.HOST
      });
    } else {
      await server.listen({
        port: env.PORT
      });
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
