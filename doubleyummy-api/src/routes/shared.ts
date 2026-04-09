import type { FastifyPluginAsync } from "fastify";
import { requireAuth } from "../middleware/auth.js";
import { sharedController } from "../controllers/sharedController.js";

export const sharedRoutes: FastifyPluginAsync = async (app) => {
  app.addHook("preHandler", requireAuth);
  app.get("/match/:id", sharedController.getMatchResult);
  app.get("/matches", sharedController.listMatches);
  app.get("/inbox", sharedController.listInbox);
  app.get("/:shareCode", sharedController.getShared);
  app.post("/:shareCode/vote", sharedController.vote);
  app.post("/:shareCode/complete", sharedController.complete);
};
