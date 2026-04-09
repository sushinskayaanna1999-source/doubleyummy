import type { FastifyReply, FastifyRequest } from "fastify";
import { UnauthorizedError } from "../utils/errors.js";

export const requireAuth = async (request: FastifyRequest, _reply: FastifyReply) => {
  try {
    await request.jwtVerify();
    request.authUser = {
      id: request.user.sub,
      email: request.user.email,
      username: request.user.username
    };
  } catch {
    throw new UnauthorizedError();
  }
};
