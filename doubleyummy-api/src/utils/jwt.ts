import type { FastifyReply, FastifyRequest } from "fastify";
import { env } from "../config/index.js";

export const jwtConfig = {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: env.JWT_EXPIRES_IN
  }
};

export type AuthTokenPayload = {
  sub: string;
  email: string;
  username: string;
};

export const signAuthToken = async (
  request: FastifyRequest,
  reply: FastifyReply,
  payload: AuthTokenPayload
) => reply.jwtSign(payload, { sign: jwtConfig.sign });
