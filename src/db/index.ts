import { Kysely } from "kysely";
import { NeonDialect } from "kysely-neon";
import { DB } from "./types";

export const db = new Kysely<DB>({
  dialect: new NeonDialect({
    connectionString: process.env.DATABASE_URL,
  }),
});
