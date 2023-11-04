import fastify from "fastify";
import sensible from "@fastify/sensible";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";

import { appRouter } from "../src/router";
import { createContext } from "../src/context";
import { config } from "../src/config/config";
import { env } from "../src/config/env";

const app = fastify({
  maxParamLength: 5000,
  logger: config[env.NODE_ENV].logger,
});

app.register(sensible);

app.register(fastifyTRPCPlugin, {
  prefix: "/api",
  trpcOptions: {
    router: appRouter,
    createContext,
  },
});

app.register(cors, {
  origin: "*",
  credentials: true,
});

app.register(helmet);

if (env.HOST) {
  app.listen({
    port: env.PORT,
    host: env.HOST,
  });
} else {
  app.listen({
    port: env.PORT,
  });
}

export default async (req: any, res: any) => {
  await app.ready();
  app.server.emit("request", req, res);
};
