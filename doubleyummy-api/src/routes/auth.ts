import type { FastifyPluginAsync } from "fastify";
import { authController } from "../controllers/authController.js";

export const authRoutes: FastifyPluginAsync = async (app) => {
  app.post("/register", authController.register);
  app.post("/login", authController.login);
  app.get("/check-username/:username", authController.checkUsername);
};
