import type { ZodSchema } from "zod";
import { BadRequestError } from "../utils/errors.js";

export const parseWithSchema = <T>(schema: ZodSchema<T>, payload: unknown): T => {
  const result = schema.safeParse(payload);

  if (!result.success) {
    const message = result.error.issues.map((issue) => issue.message).join(", ");
    throw new BadRequestError(message || "Ошибка валидации");
  }

  return result.data;
};
