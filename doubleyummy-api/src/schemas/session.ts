import { z } from "zod";
import { CUISINE_TYPES, MEAL_TYPES, MOOD_TAGS } from "../types/domain.js";

export const createSessionSchema = z.object({
  mealType: z.enum(MEAL_TYPES).nullable(),
  filters: z.object({
    cuisineTypes: z.array(z.enum(CUISINE_TYPES)).nullable(),
    tags: z.array(z.enum(MOOD_TAGS)).nullable()
  })
});

export const sessionVoteSchema = z.object({
  dishId: z.string().uuid(),
  vote: z.enum(["like", "dislike"])
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20)
});

export const sessionIdSchema = z.object({
  id: z.string().uuid()
});
