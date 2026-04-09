import type { FastifyRequest } from "fastify";
import { parseWithSchema } from "../middleware/validate.js";
import { createSessionSchema, paginationSchema, sessionIdSchema, sessionVoteSchema } from "../schemas/session.js";
import { sessionService } from "../services/sessionService.js";

export const sessionController = {
  async create(request: FastifyRequest) {
    const payload = parseWithSchema(createSessionSchema, request.body);
    const result = await sessionService.create(request.authUser.id, payload);
    return { session: result.session, dishes: result.dishes };
  },

  async vote(request: FastifyRequest<{ Params: { id: string } }>) {
    const params = parseWithSchema(sessionIdSchema, request.params);
    const payload = parseWithSchema(sessionVoteSchema, request.body);
    return sessionService.vote(request.authUser.id, params.id, payload);
  },

  async complete(request: FastifyRequest<{ Params: { id: string } }>) {
    const params = parseWithSchema(sessionIdSchema, request.params);
    return sessionService.complete(request.authUser.id, params.id);
  },

  async list(request: FastifyRequest) {
    const query = parseWithSchema(paginationSchema, request.query);
    return sessionService.list(request.authUser.id, query.page, query.limit);
  },

  async getById(request: FastifyRequest<{ Params: { id: string } }>) {
    const params = parseWithSchema(sessionIdSchema, request.params);
    return sessionService.getById(request.authUser.id, params.id);
  }
};
