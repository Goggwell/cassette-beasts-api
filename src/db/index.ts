import { Kysely } from "kysely";
import { NeonDialect } from "kysely-neon";
import { DB } from "./types";
import "dotenv/config";
import ws from "ws";

export const db = new Kysely<DB>({
  dialect: new NeonDialect({
    connectionString: process.env.DATABASE_URL,
    webSocketConstructor: ws,
  }),
});
