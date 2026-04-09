import type { FastifyPluginAsync } from "fastify";
import { profileController } from "../controllers/profileController.js";
import { requireAuth } from "../middleware/auth.js";

export const profileRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", { preHandler: requireAuth }, profileController.getProfile);
  app.put("/", { preHandler: requireAuth }, profileController.updateProfile);
};
