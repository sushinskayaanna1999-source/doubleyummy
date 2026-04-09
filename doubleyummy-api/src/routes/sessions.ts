import type { FastifyPluginAsync } from "fastify";
import { sessionController } from "../controllers/sessionController.js";
import { requireAuth } from "../middleware/auth.js";
import { sharedController } from "../controllers/sharedController.js";

export const sessionRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("preHandler", requireAuth);
  app.post("/", sessionController.create);
  app.get("/", sessionController.list);
  app.get("/:id", sessionController.getById);
  app.post("/:id/vote", sessionController.vote);
  app.post("/:id/complete", sessionController.complete);
  app.post("/:id/share", sharedController.share);
};
