import { Kysely } from "kysely";
import { NeonDialect } from "../kysely-neon/neon-dialect";
import ws from "ws";
import { DB } from "./types";

export const db = new Kysely<DB>({
  dialect: new NeonDialect({
    connectionString: process.env.DATABASE_URL,
    webSocketConstructor: ws,
  }),
});
