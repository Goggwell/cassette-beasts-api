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

// src/kysely-neon/neon-dialect.ts
var neon_dialect_exports = {};
__export(neon_dialect_exports, {
  NeonDialect: () => NeonDialect
});
module.exports = __toCommonJS(neon_dialect_exports);
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
  constructor(config) {
    __privateAdd(this, _config, void 0);
    __privateSet(this, _config, config);
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
  createIntrospector(db) {
    return new import_kysely.PostgresIntrospector(db);
  }
};
_config = new WeakMap();
var _config2, _connections, _pool;
var NeonDriver = class {
  constructor(config) {
    __privateAdd(this, _config2, void 0);
    __privateAdd(this, _connections, /* @__PURE__ */ new WeakMap());
    __privateAdd(this, _pool, void 0);
    __privateSet(this, _config2, config);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  NeonDialect
});
