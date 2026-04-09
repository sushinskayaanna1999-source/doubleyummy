import type { FastifyPluginAsync } from "fastify";
import { dishController } from "../controllers/dishController.js";
import { requireAuth } from "../middleware/auth.js";

export const dishRoutes: FastifyPluginAsync = async (app) => {
  app.get("/", { preHandler: requireAuth }, dishController.list);
  app.get("/:id", { preHandler: requireAuth }, dishController.getById);
  app.post("/", { preHandler: requireAuth }, dishController.create);
  app.put("/:id", { preHandler: requireAuth }, dishController.update);
  app.delete("/:id", { preHandler: requireAuth }, dishController.remove);
};
