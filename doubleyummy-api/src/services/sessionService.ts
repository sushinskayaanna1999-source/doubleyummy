import { prisma } from "../lib/prisma.js";
import { ForbiddenError, NotFoundError } from "../utils/errors.js";

const sessionInclude = {
  votes: true,
  shares: true
} as const;

const dishCardInclude = {
  media: { orderBy: { sortOrder: "asc" } },
  mealTypes: true,
  tags: true
} as const;

const mapDish = <T extends { mealTypes: { mealType: string }[]; tags: { tag: string }[] }>(dish: T) => ({
  ...dish,
  mealTypes: dish.mealTypes.map((item) => item.mealType),
  tags: dish.tags.map((item) => item.tag)
});

const shuffle = <T>(items: T[]) => [...items].sort(() => Math.random() - 0.5);

export const sessionService = {
  async create(userId: string, input: { mealType: string | null; filters: { cuisineTypes: string[] | null; tags: string[] | null } }) {
    const session = await prisma.swipeSession.create({
      data: {
        userId,
        mealType: input.mealType,
        filtersJson: input.filters
      }
    });

    const dishes = await this.getAvailableDishes(session.id, userId);

    return {
      session,
      dishes
    };
  },

  async getAvailableDishes(sessionId: string, userId: string) {
    const session = await prisma.swipeSession.findFirst({ where: { id: sessionId, userId } });

    if (!session) {
      throw new NotFoundError("Сессия не найдена");
    }

    const filters = (session.filtersJson as { cuisineTypes: string[] | null; tags: string[] | null } | null) ?? {
      cuisineTypes: null,
      tags: null
    };
    const voted = await prisma.swipeVote.findMany({
      where: { sessionId },
      select: { dishId: true }
    });

    const dishes = await prisma.dish.findMany({
      where: {
        userId,
        id: { notIn: voted.map((item) => item.dishId) },
        ...(session.mealType ? { mealTypes: { some: { mealType: session.mealType } } } : {}),
        ...(filters.cuisineTypes ? { cuisineType: { in: filters.cuisineTypes } } : {}),
        ...(filters.tags ? { tags: { some: { tag: { in: filters.tags } } } } : {})
      },
      include: dishCardInclude
    });

    return shuffle(dishes.map(mapDish));
  },

  async vote(userId: string, sessionId: string, input: { dishId: string; vote: "like" | "dislike" }) {
    const session = await prisma.swipeSession.findFirst({ where: { id: sessionId, userId } });

    if (!session) {
      throw new NotFoundError("Сессия не найдена");
    }

    await prisma.swipeVote.upsert({
      where: { sessionId_dishId: { sessionId, dishId: input.dishId } },
      create: {
        sessionId,
        dishId: input.dishId,
        vote: input.vote
      },
      update: {
        vote: input.vote
      }
    });

    return { success: true };
  },

  async complete(userId: string, sessionId: string) {
    const session = await prisma.swipeSession.findFirst({ where: { id: sessionId, userId } });

    if (!session) {
      throw new NotFoundError("Сессия не найдена");
    }

    const updated = await prisma.swipeSession.update({
      where: { id: sessionId },
      data: {
        status: "completed",
        completedAt: new Date()
      }
    });

    const likes = await prisma.dish.findMany({
      where: {
        swipeVotes: {
          some: {
            sessionId,
            vote: "like"
          }
        }
      },
      include: dishCardInclude
    });

    return {
      session: updated,
      likes: likes.map(mapDish)
    };
  },

  async list(userId: string, page: number, limit: number) {
    const [total, sessions] = await Promise.all([
      prisma.swipeSession.count({ where: { userId } }),
      prisma.swipeSession.findMany({
        where: { userId },
        include: sessionInclude,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit
      })
    ]);

    return {
      sessions: sessions.map((session) => ({
        id: session.id,
        mealType: session.mealType,
        createdAt: session.createdAt,
        status: session.status,
        likesCount: session.votes.filter((vote) => vote.vote === "like").length,
        hasShared: session.shares.length > 0
      })),
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit))
    };
  },

  async getById(userId: string, sessionId: string) {
    const session = await prisma.swipeSession.findFirst({
      where: { id: sessionId, userId },
      include: { votes: true }
    });

    if (!session) {
      throw new NotFoundError("Сессия не найдена");
    }

    const likes = await prisma.dish.findMany({
      where: {
        swipeVotes: {
          some: { sessionId, vote: "like" }
        }
      },
      include: dishCardInclude
    });

    return {
      session,
      votes: session.votes,
      likes: likes.map(mapDish)
    };
  },

  async assertSessionOwner(userId: string, sessionId: string) {
    const session = await prisma.swipeSession.findUnique({ where: { id: sessionId } });
    if (!session) {
      throw new NotFoundError("Сессия не найдена");
    }
    if (session.userId !== userId) {
      throw new ForbiddenError();
    }
    return session;
  }
};
