import type { FastifyRequest } from "fastify";
import { processAndStoreImage } from "../services/storageService.js";
import { BadRequestError } from "../utils/errors.js";

export const uploadController = {
  async image(request: FastifyRequest) {
    const file = await request.file();

    if (!file) {
      throw new BadRequestError("Файл не передан");
    }

    const url = await processAndStoreImage(file);
    return { url };
  }
};
