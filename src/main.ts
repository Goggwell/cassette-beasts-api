import fastify from "fastify";
import sensible from "@fastify/sensible";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import fastifyHealthcheck from "fastify-healthcheck";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";

import { appRouter } from "./router";
import { createContext } from "./context";
import { config } from "./config/config";
import { env } from "./config/env";

const server = fastify({
  maxParamLength: 5000,
  logger: config[env.NODE_ENV].logger,
});

server.register(sensible);

server.register(fastifyHealthcheck);

server.register(fastifyTRPCPlugin, {
  prefix: "/api",
  trpcOptions: {
    router: appRouter,
    createContext,
  },
});

server.register(cors, {
  origin: "*",
  credentials: true,
});

server.register(helmet);

server.get("/", (req, res) => res.status(200).send("Hello world!"));

if ("RENDER" in process.env) {
  server.listen({
    port: env.PORT,
    host: `0.0.0.0`,
  });
} else {
  server.listen({
    port: env.PORT,
    host: env.HOST,
  });
}
