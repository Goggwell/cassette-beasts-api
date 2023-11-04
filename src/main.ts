import fastify from "fastify";
import cors from "@fastify/cors";
import { fastifyTRPCPlugin } from "@trpc/server/adapters/fastify";

import { appRouter } from "./router";
import { createContext } from "./context";

(async () => {
  try {
    const server = await fastify({
      maxParamLength: 5000,
    });

    await server.register(cors, {
      origin: "http://localhost:5173",
    });

    await server.register(fastifyTRPCPlugin, {
      prefix: "/trpc",
      trpcOptions: {
        router: appRouter,
        createContext,
      },
    });

    await server.listen({
      port: 3333,
    });
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
