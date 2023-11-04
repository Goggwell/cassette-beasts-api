import { Kysely } from "kysely";
import { NeonHTTPDialect } from "kysely-neon";
import { DB } from "./types";

export const db = new Kysely<DB>({
  dialect: new NeonHTTPDialect({
    connectionString: process.env.DATABASE_URL!,
  }),
});
