import { z } from "zod";
import { CUISINE_TYPES, MEAL_TYPES, MOOD_TAGS } from "../types/domain.js";

export const dishQuerySchema = z.object({
  meal_type: z.enum(MEAL_TYPES).optional(),
  cuisine_type: z.enum(CUISINE_TYPES).optional(),
  tags: z.string().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20)
});

export const dishIdSchema = z.object({
  id: z.string().uuid()
});

const optionalUrl = z.union([z.literal(""), z.string().url()]).transform((value) => value || null);

export const dishFormSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().max(500).optional().nullable(),
  recipeText: z.string().max(5000).optional().nullable(),
  recipeUrl: optionalUrl.optional().default(null),
  cuisineType: z.enum(CUISINE_TYPES).optional().nullable(),
  mealTypes: z.array(z.enum(MEAL_TYPES)).min(1),
  tags: z.array(z.enum(MOOD_TAGS)).optional().default([])
});

export const updateDishSchema = dishFormSchema.partial().extend({
  deleteMediaIds: z.array(z.string().uuid()).optional().default([])
});
