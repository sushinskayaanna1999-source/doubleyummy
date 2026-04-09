import type { MultipartFile } from "@fastify/multipart";
import { prisma } from "../lib/prisma.js";
import { NotFoundError } from "../utils/errors.js";
import { processAndStoreImage } from "./storageService.js";

const dishInclude = {
  media: { orderBy: { sortOrder: "asc" } },
  mealTypes: true,
  tags: true
} as const;

const mapDish = <T extends {
  mealTypes: { mealType: string }[];
  tags: { tag: string }[];
}>(dish: T) => ({
  ...dish,
  mealTypes: dish.mealTypes.map((item) => item.mealType),
  tags: dish.tags.map((item) => item.tag)
});

export const dishService = {
  async list(userId: string, params: { meal_type?: string; cuisine_type?: string; tags?: string; search?: string; page: number; limit: number }) {
    const tags = params.tags?.split(",").filter(Boolean);
    const where = {
      userId,
      ...(params.cuisine_type ? { cuisineType: params.cuisine_type } : {}),
      ...(params.search ? { title: { contains: params.search, mode: "insensitive" as const } } : {}),
      ...(params.meal_type ? { mealTypes: { some: { mealType: params.meal_type } } } : {}),
      ...(tags?.length ? { tags: { some: { tag: { in: tags } } } } : {})
    };

    const [total, dishes] = await Promise.all([
      prisma.dish.count({ where }),
      prisma.dish.findMany({
        where,
        include: dishInclude,
        orderBy: { createdAt: "desc" },
        skip: (params.page - 1) * params.limit,
        take: params.limit
      })
    ]);

    return {
      dishes: dishes.map(mapDish),
      total,
      page: params.page,
      totalPages: Math.max(1, Math.ceil(total / params.limit))
    };
  },

  async getById(userId: string, dishId: string) {
    const dish = await prisma.dish.findFirst({
      where: { id: dishId, userId },
      include: dishInclude
    });

    if (!dish) {
      throw new NotFoundError("Блюдо не найдено");
    }

    return mapDish(dish);
  },

  async create(userId: string, data: {
    title: string;
    description?: string | null;
    recipeText?: string | null;
    recipeUrl?: string | null;
    cuisineType?: string | null;
    mealTypes: string[];
    tags: string[];
  }, photos: MultipartFile[]) {
    const media = await Promise.all(
      photos.map(async (photo, index) => ({
        mediaType: "photo",
        url: await processAndStoreImage(photo),
        sortOrder: index
      }))
    );

    const dish = await prisma.dish.create({
      data: {
        userId,
        title: data.title,
        description: data.description ?? null,
        recipeText: data.recipeText ?? null,
        recipeUrl: data.recipeUrl ?? null,
        cuisineType: data.cuisineType ?? null,
        media: { create: media },
        mealTypes: { createMany: { data: data.mealTypes.map((mealType) => ({ mealType })) } },
        tags: { createMany: { data: data.tags.map((tag) => ({ tag })) } }
      },
      include: dishInclude
    });

    return mapDish(dish);
  },

  async update(userId: string, dishId: string, data: Partial<{
    title: string;
    description: string | null;
    recipeText: string | null;
    recipeUrl: string | null;
    cuisineType: string | null;
    mealTypes: string[];
    tags: string[];
    deleteMediaIds: string[];
  }>, newPhotos: MultipartFile[]) {
    await this.getById(userId, dishId);
    const media = await Promise.all(
      newPhotos.map(async (photo, index) => ({
        mediaType: "photo",
        url: await processAndStoreImage(photo),
        sortOrder: index
      }))
    );

    const dish = await prisma.dish.update({
      where: { id: dishId },
      data: {
        ...(data.title !== undefined ? { title: data.title } : {}),
        ...(data.description !== undefined ? { description: data.description } : {}),
        ...(data.recipeText !== undefined ? { recipeText: data.recipeText } : {}),
        ...(data.recipeUrl !== undefined ? { recipeUrl: data.recipeUrl } : {}),
        ...(data.cuisineType !== undefined ? { cuisineType: data.cuisineType } : {}),
        ...(data.deleteMediaIds?.length
          ? { media: { deleteMany: { id: { in: data.deleteMediaIds } } } }
          : {}),
        ...(media.length ? { media: { create: media } } : {}),
        ...(data.mealTypes
          ? {
              mealTypes: {
                deleteMany: {},
                createMany: { data: data.mealTypes.map((mealType) => ({ mealType })) }
              }
            }
          : {}),
        ...(data.tags
          ? {
              tags: {
                deleteMany: {},
                createMany: { data: data.tags.map((tag) => ({ tag })) }
              }
            }
          : {})
      },
      include: dishInclude
    });

    return mapDish(dish);
  },

  async remove(userId: string, dishId: string) {
    await this.getById(userId, dishId);
    await prisma.dish.delete({ where: { id: dishId } });
    return { success: true };
  }
};
