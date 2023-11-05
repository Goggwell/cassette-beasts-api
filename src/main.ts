import fastify from "fastify";
import sensible from "@fastify/sensible";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import fastifyHealthcheck from "fastify-healthcheck";
import fastifyFavicon from "fastify-favicon";
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

server.register(fastifyFavicon);

server.get("/", (req, res) => res.status(200).send("Hello world!"));

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
