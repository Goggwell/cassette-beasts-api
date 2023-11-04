import fastify from "fastify";
import sensible from "@fastify/sensible";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";

import { appRouter } from "./router";
import { createContext } from "./context";
import { fastifyConfig } from "./config/config";
import { env } from "./config/env";

(async () => {
  try {
    const server = await fastify({
      maxParamLength: 5000,
      logger: fastifyConfig[env.NODE_ENV].logger,
    });

    await server.register(sensible);

    await server.register(fastifyTRPCPlugin, {
      prefix: "/api",
      trpcOptions: {
        router: appRouter,
        createContext,
      },
    });

    await server.register(cors, {
      origin: "*",
      credentials: true,
    });

    await server.register(helmet);

    if (env.HOST) {
      await server.listen({
        port: env.PORT,
        host: env.HOST,
      });
    } else {
      await server.listen({
        port: env.PORT,
      });
    }
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
