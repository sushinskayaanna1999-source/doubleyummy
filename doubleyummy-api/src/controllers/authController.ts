import type { FastifyReply, FastifyRequest } from "fastify";
import { authService } from "../services/authService.js";
import { parseWithSchema } from "../middleware/validate.js";
import { loginSchema, registerSchema, usernameSchema } from "../schemas/auth.js";
import { signAuthToken } from "../utils/jwt.js";

export const authController = {
  async register(request: FastifyRequest, reply: FastifyReply) {
    const payload = parseWithSchema(registerSchema, request.body);
    const user = await authService.register(payload);
    const token = await signAuthToken(request, reply, {
      sub: user.id,
      email: user.email,
      username: user.username
    });
    return reply.code(201).send({ token, user });
  },

  async login(request: FastifyRequest, reply: FastifyReply) {
    const payload = parseWithSchema(loginSchema, request.body);
    const user = await authService.login(payload);
    const token = await signAuthToken(request, reply, {
      sub: user.id,
      email: user.email,
      username: user.username
    });
    return reply.send({ token, user });
  },

  async checkUsername(request: FastifyRequest<{ Params: { username: string } }>) {
    const username = parseWithSchema(usernameSchema, request.params.username);
    const available = await authService.isUsernameAvailable(username);
    return { available };
  }
};
