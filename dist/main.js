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
var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};

// src/main.ts
var import_fastify = __toESM(require("fastify"));
var import_sensible = __toESM(require("@fastify/sensible"));
var import_cors = __toESM(require("@fastify/cors"));
var import_helmet = __toESM(require("@fastify/helmet"));
var import_fastify_healthcheck = __toESM(require("fastify-healthcheck"));
var import_fastify_favicon = __toESM(require("fastify-favicon"));
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

// src/db/index.ts
var import_kysely2 = require("kysely");

// src/kysely-neon/neon-dialect.ts
var import_kysely = require("kysely");
var import_serverless = require("@neondatabase/serverless");

// src/kysely-neon/neon-connection.ts
var PRIVATE_RELEASE_METHOD = Symbol("release");
var _client;
var NeonConnection = class {
  constructor(client) {
    __privateAdd(this, _client, void 0);
    __privateSet(this, _client, client);
  }
  async executeQuery(compiledQuery) {
    const result = await __privateGet(this, _client).query(compiledQuery.sql, [
      ...compiledQuery.parameters
    ]);
    if (result.command === "INSERT" || result.command === "UPDATE" || result.command === "DELETE") {
      const numAffectedRows = BigInt(result.rowCount);
      return {
        // TODO: remove.
        numUpdatedOrDeletedRows: numAffectedRows,
        numAffectedRows,
        rows: result.rows ?? []
      };
    }
    return {
      rows: result.rows ?? []
    };
  }
  async *streamQuery(_compiledQuery, _chunkSize) {
    throw new Error("Neon Driver does not support streaming");
  }
  [PRIVATE_RELEASE_METHOD]() {
    __privateGet(this, _client).release?.();
  }
};
_client = new WeakMap();

// src/kysely-neon/neon-dialect.ts
var _config;
var NeonDialect = class {
  constructor(config2) {
    __privateAdd(this, _config, void 0);
    __privateSet(this, _config, config2);
  }
  createAdapter() {
    return new import_kysely.PostgresAdapter();
  }
  createDriver() {
    return new NeonDriver(__privateGet(this, _config));
  }
  createQueryCompiler() {
    return new import_kysely.PostgresQueryCompiler();
  }
  createIntrospector(db2) {
    return new import_kysely.PostgresIntrospector(db2);
  }
};
_config = new WeakMap();
var _config2, _connections, _pool;
var NeonDriver = class {
  constructor(config2) {
    __privateAdd(this, _config2, void 0);
    __privateAdd(this, _connections, /* @__PURE__ */ new WeakMap());
    __privateAdd(this, _pool, void 0);
    __privateSet(this, _config2, config2);
  }
  async init() {
    Object.assign(import_serverless.neonConfig, __privateGet(this, _config2));
    __privateSet(this, _pool, new import_serverless.Pool(__privateGet(this, _config2)));
  }
  async acquireConnection() {
    const client = await __privateGet(this, _pool).connect();
    let connection = __privateGet(this, _connections).get(client);
    if (!connection) {
      connection = new NeonConnection(client);
      __privateGet(this, _connections).set(client, connection);
    }
    return connection;
  }
  async beginTransaction(conn, settings) {
    if (settings.isolationLevel) {
      await conn.executeQuery(
        import_kysely.CompiledQuery.raw(
          `start transaction isolation level ${settings.isolationLevel}`
        )
      );
    } else {
      await conn.executeQuery(import_kysely.CompiledQuery.raw("begin"));
    }
  }
  async commitTransaction(conn) {
    await conn.executeQuery(import_kysely.CompiledQuery.raw("commit"));
  }
  async rollbackTransaction(conn) {
    await conn.executeQuery(import_kysely.CompiledQuery.raw("rollback"));
  }
  async releaseConnection(connection) {
    connection[PRIVATE_RELEASE_METHOD]();
  }
  async destroy() {
    if (__privateGet(this, _pool)) {
      const pool = __privateGet(this, _pool);
      __privateSet(this, _pool, void 0);
      await pool.end();
    }
  }
};
_config2 = new WeakMap();
_connections = new WeakMap();
_pool = new WeakMap();

// src/db/index.ts
var import_ws = __toESM(require("ws"));
var db = new import_kysely2.Kysely({
  dialect: new NeonDialect({
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
var server = (0, import_fastify.default)({
  maxParamLength: 5e3,
  logger: config[env.NODE_ENV].logger
});
server.register(import_sensible.default);
server.register(import_fastify_healthcheck.default);
server.register(import_fastify2.fastifyTRPCPlugin, {
  prefix: "/api",
  trpcOptions: {
    router: appRouter,
    createContext,
    responseMeta: (opts) => {
      const { ctx, errors, type } = opts;
      const allOk = errors.length === 0;
      const isQuery = type === "query";
      if (ctx?.res && allOk && isQuery) {
        return {
          headers: {
            "cache-control": `s-maxage=300, stale-while-revalidate=60, stale-if-error=86400`
          }
        };
      }
      return {};
    }
  }
});
server.register(import_cors.default, {
  origin: "*",
  credentials: true
});
server.register(import_helmet.default);
server.register(import_fastify_favicon.default);
server.get("/", (req, res) => res.status(200).send("Hello world!"));
if ("RENDER" in process.env || env.NODE_ENV === `production`) {
  server.listen({
    port: env.PORT,
    host: `0.0.0.0`
  });
} else {
  server.listen({
    port: env.PORT
  });
}
