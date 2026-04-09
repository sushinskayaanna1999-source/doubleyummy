import type { FastifyRequest } from "fastify";
import { parseWithSchema } from "../middleware/validate.js";
import { shareCodeSchema, partnerVoteSchema } from "../schemas/shared.js";
import { sessionIdSchema, paginationSchema } from "../schemas/session.js";
import { matchService } from "../services/matchService.js";

export const sharedController = {
  async share(request: FastifyRequest<{ Params: { id: string } }>) {
    const params = parseWithSchema(sessionIdSchema, request.params);
    return matchService.share(request.authUser.id, params.id);
  },

  async getShared(request: FastifyRequest<{ Params: { shareCode: string } }>) {
    const params = parseWithSchema(shareCodeSchema, request.params);
    return matchService.getSharedForVoting(request.authUser.id, params.shareCode);
  },

  async vote(request: FastifyRequest<{ Params: { shareCode: string } }>) {
    const params = parseWithSchema(shareCodeSchema, request.params);
    const payload = parseWithSchema(partnerVoteSchema, request.body);
    return matchService.vote(request.authUser.id, params.shareCode, payload);
  },

  async complete(request: FastifyRequest<{ Params: { shareCode: string } }>) {
    const params = parseWithSchema(shareCodeSchema, request.params);
    return matchService.complete(request.authUser.id, params.shareCode);
  },

  async listMatches(request: FastifyRequest) {
    const query = parseWithSchema(paginationSchema, request.query);
    return matchService.listMatches(request.authUser.id, query.page, query.limit);
  },

  async listInbox(request: FastifyRequest) {
    return matchService.listInbox(request.authUser.id);
  },

  async getMatchResult(request: FastifyRequest<{ Params: { id: string } }>) {
    const params = parseWithSchema(sessionIdSchema, request.params);
    return matchService.getMatchResult(request.authUser.id, params.id);
  }
};
