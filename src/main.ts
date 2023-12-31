import fastify from "fastify";
import sensible from "@fastify/sensible";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import fastifyHealthcheck from "fastify-healthcheck";
import fastifyFavicon from "fastify-favicon";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";
import { ProcedureType, TRPCError } from "@trpc/server";

import { appRouter } from "./router";
import { createContext } from "./context";
import { config } from "./config/config";
import { env } from "./config/env";

interface IResponseMetaOpts {
  ctx?: any;
  errors: TRPCError[];
  type: ProcedureType | "unknown";
}

const server = fastify({
  maxParamLength: 5000,
  logger: config[env.NODE_ENV].logger,
});

server.register(fastifyTRPCPlugin, {
  prefix: "/api",
  trpcOptions: {
    router: appRouter,
    createContext,
    responseMeta: (opts: IResponseMetaOpts) => {
      const { ctx, errors, type } = opts;

      const allOk = errors.length === 0;
      const isQuery = type === "query";

      if (ctx?.res && allOk && isQuery) {
        return {
          headers: {
            "cache-control": `s-maxage=300, stale-while-revalidate=60, stale-if-error=86400`,
          },
        };
      }
      return {};
    },
  },
});

// custom fastify plugins
server.register(helmet);
server.register(sensible);
server.register(fastifyFavicon);
server.register(fastifyHealthcheck);

server.register(cors, {
  origin: "*",
  credentials: true,
});

// default endpoints, just so they don't return 404
server.get("/", (req, res) =>
  res.status(200).send("Try querying for monsters! --> /api/getMonsters")
);
server.get("/api", (req, res) =>
  res.status(200).send("Try querying for monsters! --> /api/getMonsters")
);

if ("RENDER" in process.env || env.NODE_ENV === `production`) {
  server.listen({
    port: env.PORT,
    host: `0.0.0.0`,
  });
} else {
  server.listen({
    port: env.PORT,
  });
}
