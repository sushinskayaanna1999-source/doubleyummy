import type { FastifyPluginAsync } from "fastify";
import { requireAuth } from "../middleware/auth.js";
import { uploadController } from "../controllers/uploadController.js";

export const uploadRoutes: FastifyPluginAsync = async (app) => {
  app.post("/image", { preHandler: requireAuth }, uploadController.image);
};
