import type { FastifyRequest } from "fastify";
import type { MultipartFile } from "@fastify/multipart";
import { dishService } from "../services/dishService.js";
import { parseWithSchema } from "../middleware/validate.js";
import { dishFormSchema, dishIdSchema, dishQuerySchema, updateDishSchema } from "../schemas/dish.js";
import { BadRequestError } from "../utils/errors.js";

const parseMultipartDish = async (request: FastifyRequest) => {
  const fields: Record<string, string> = {};
  const files: MultipartFile[] = [];

  const parts = request.parts();
  for await (const part of parts) {
    if (part.type === "file") {
      if (part.filename) {
        const buffer = await part.toBuffer();
        Object.assign(part, { _buf: buffer, toBuffer: async () => buffer });
        files.push(part);
      } else {
        await part.toBuffer();
      }
    } else {
      fields[part.fieldname] = String(part.value);
    }
  }

  return { fields, files };
};

const normalizeDishFields = (fields: Record<string, string>) => ({
  title: fields.title,
  description: fields.description || null,
  recipeText: fields.recipeText || null,
  recipeUrl: fields.recipeUrl || null,
  cuisineType: fields.cuisineType || null,
  mealTypes: fields.mealTypes ? fields.mealTypes.split(",").filter(Boolean) : [],
  tags: fields.tags ? fields.tags.split(",").filter(Boolean) : []
});

export const dishController = {
  async list(request: FastifyRequest) {
    const query = parseWithSchema(dishQuerySchema, request.query);
    return dishService.list(request.authUser.id, query);
  },

  async getById(request: FastifyRequest<{ Params: { id: string } }>) {
    const params = parseWithSchema(dishIdSchema, request.params);
    const dish = await dishService.getById(request.authUser.id, params.id);
    return { dish };
  },

  async create(request: FastifyRequest) {
    console.log("CREATE STARTED", request.headers["content-type"]);
    const { fields, files } = await parseMultipartDish(request);
    console.log("FIELDS:", fields);
    console.log("FILES:", files.length);
    if (files.length === 0) {
      throw new BadRequestError("Нужно добавить хотя бы одну фотографию");
    }
    const data = parseWithSchema(dishFormSchema, normalizeDishFields(fields));
    const dish = await dishService.create(request.authUser.id, data, files);
    return { dish };
  },

  async update(request: FastifyRequest<{ Params: { id: string } }>) {
    const params = parseWithSchema(dishIdSchema, request.params);
    const { fields, files } = await parseMultipartDish(request);
    const payload = parseWithSchema(
      updateDishSchema,
      {
        ...normalizeDishFields(fields),
        deleteMediaIds: fields.deleteMediaIds ? fields.deleteMediaIds.split(",").filter(Boolean) : []
      }
    );
    const dish = await dishService.update(request.authUser.id, params.id, payload, files);
    return { dish };
  },

  async remove(request: FastifyRequest<{ Params: { id: string } }>) {
    const params = parseWithSchema(dishIdSchema, request.params);
    return dishService.remove(request.authUser.id, params.id);
  }
};
