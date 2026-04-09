import Fastify from "fastify";
import cors from "@fastify/cors";
import jwt from "@fastify/jwt";
import multipart from "@fastify/multipart";
import fastifyStatic from "@fastify/static";
import { config, env } from "./config/index.js";
import { jwtConfig } from "./utils/jwt.js";
import { AppError } from "./utils/errors.js";
import { authRoutes } from "./routes/auth.js";
import { profileRoutes } from "./routes/profile.js";
import { dishRoutes } from "./routes/dishes.js";
import { sessionRoutes } from "./routes/sessions.js";
import { sharedRoutes } from "./routes/shared.js";
import { uploadRoutes } from "./routes/upload.js";
import { requireAuth } from "./middleware/auth.js";
import { sharedController } from "./controllers/sharedController.js";

export const buildApp = () => {
  const app = Fastify({ logger: true });

  app.register(cors, {
    origin: env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
   });
  app.register(jwt, jwtConfig);
  app.register(multipart, {
    attachFieldsToBody: false,
    limits: {
      fileSize: 10 * 1024 * 1024,
      files: 5
    }
  });
  app.register(fastifyStatic, {
    root: config.uploadsDir,
    prefix: "/uploads/"
  });

  app.get("/health", async () => ({ status: "ok" }));

  app.register(async (api) => {
    api.register(authRoutes, { prefix: "/auth" });
    api.register(profileRoutes, { prefix: "/profile" });
    api.register(dishRoutes, { prefix: "/dishes" });
    api.register(sessionRoutes, { prefix: "/sessions" });
    api.register(sharedRoutes, { prefix: "/shared" });
    api.register(uploadRoutes, { prefix: "/upload" });
    api.get("/matches", { preHandler: requireAuth }, sharedController.listMatches);
  }, { prefix: "/api/v1" });

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        error: error.code,
        message: error.message
      });
    }

    app.log.error(error);
    return reply.status(500).send({
      error: "INTERNAL_SERVER_ERROR",
      message: "Что-то пошло не так"
    });
  });

  return app;
};
