import type { FastifyRequest } from "fastify";
import { prisma } from "../lib/prisma.js";
import { parseWithSchema } from "../middleware/validate.js";
import { z } from "zod";
import { usernameSchema } from "../schemas/auth.js";
import { ConflictError } from "../utils/errors.js";

const updateProfileSchema = z.object({
  username: usernameSchema
});

export const profileController = {
  async getProfile(request: FastifyRequest) {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: request.authUser.id },
      select: { id: true, email: true, username: true, avatarUrl: true }
    });

    return user;
  },

  async updateProfile(request: FastifyRequest) {
    const body = parseWithSchema(updateProfileSchema, request.body);
    const exists = await prisma.user.findFirst({
      where: {
        username: body.username,
        id: { not: request.authUser.id }
      }
    });

    if (exists) {
      throw new ConflictError("Username уже занят");
    }

    const user = await prisma.user.update({
      where: { id: request.authUser.id },
      data: { username: body.username },
      select: { id: true, email: true, username: true, avatarUrl: true }
    });

    return { user };
  }
};
