import { prisma } from "../lib/prisma.js";
import { env } from "../config/index.js";
import { generateShareCode } from "../utils/shareCode.js";
import { ForbiddenError, NotFoundError } from "../utils/errors.js";

const dishInclude = {
  media: { orderBy: { sortOrder: "asc" } },
  mealTypes: true,
  tags: true
} as const;

const mapDish = <T extends { mealTypes: { mealType: string }[]; tags: { tag: string }[] }>(dish: T) => ({
  ...dish,
  mealTypes: dish.mealTypes.map((item) => item.mealType),
  tags: dish.tags.map((item) => item.tag)
});

export const matchService = {
  async share(userId: string, sessionId: string) {
    const session = await prisma.swipeSession.findFirst({
      where: { id: sessionId, userId }
    });

    if (!session) {
      throw new NotFoundError("Сессия не найдена");
    }

    const existing = await prisma.sharedSession.findFirst({ where: { sessionId, senderId: userId } });

    const sharedSession = existing ?? (await prisma.sharedSession.create({
      data: {
        sessionId,
        senderId: userId,
        shareCode: generateShareCode()
      }
    }));

    return {
      sharedSession,
      shareUrl: `${env.FRONTEND_URL}/collections/shared/${sharedSession.shareCode}`
    };
  },

  async getSharedForVoting(userId: string, shareCode: string) {
    const sharedSession = await prisma.sharedSession.findUnique({
      where: { shareCode },
      include: {
        sender: { select: { username: true } },
        session: true
      }
    });

    if (!sharedSession) {
      throw new NotFoundError("Подборка не найдена");
    }

    if (sharedSession.senderId === userId) {
      throw new ForbiddenError("Нельзя голосовать в своей подборке");
    }

    const dishes = await prisma.dish.findMany({
      where: {
        swipeVotes: {
          some: {
            sessionId: sharedSession.sessionId,
            vote: "like"
          }
        }
      },
      include: dishInclude
    });

    return {
      sharedSession,
      dishes: dishes.map(mapDish)
    };
  },

  async vote(userId: string, shareCode: string, input: { dishId: string; vote: "like" | "dislike" }) {
    const sharedSession = await prisma.sharedSession.findUnique({ where: { shareCode } });

    if (!sharedSession) {
      throw new NotFoundError("Подборка не найдена");
    }

    await prisma.partnerVote.upsert({
      where: {
        sharedSessionId_dishId: {
          sharedSessionId: sharedSession.id,
          dishId: input.dishId
        }
      },
      create: {
        sharedSessionId: sharedSession.id,
        dishId: input.dishId,
        vote: input.vote
      },
      update: {
        vote: input.vote
      }
    });

    if (!sharedSession.recipientId || sharedSession.recipientId !== userId) {
      await prisma.sharedSession.update({
        where: { id: sharedSession.id },
        data: { recipientId: userId }
      });
    }

    return { success: true };
  },

  async complete(userId: string, shareCode: string) {
    const sharedSession = await prisma.sharedSession.findUnique({
      where: { shareCode },
      include: { session: true }
    });

    if (!sharedSession) {
      throw new NotFoundError("Подборка не найдена");
    }

    if (sharedSession.recipientId && sharedSession.recipientId !== userId) {
      throw new ForbiddenError();
    }

    const [senderLikes, partnerLikes] = await Promise.all([
      prisma.swipeVote.findMany({
        where: { sessionId: sharedSession.sessionId, vote: "like" },
        select: { dishId: true }
      }),
      prisma.partnerVote.findMany({
        where: { sharedSessionId: sharedSession.id, vote: "like" },
        select: { dishId: true }
      })
    ]);

    const matchedIds = senderLikes
      .map((vote) => vote.dishId)
      .filter((dishId) => partnerLikes.some((partnerVote) => partnerVote.dishId === dishId));

    const matches = await prisma.dish.findMany({
      where: { id: { in: matchedIds } },
      include: dishInclude
    });

    await prisma.sharedSession.update({
      where: { id: sharedSession.id },
      data: {
        status: "voted",
        votedAt: new Date(),
        recipientId: userId
      }
    });

    return {
      sharedSessionId: sharedSession.id,
      matches: matches.map(mapDish),
      totalMatches: matches.length
    };
  },

  async listMatches(userId: string, page: number, limit: number) {
    const sharedSessions = await prisma.sharedSession.findMany({
      where: {
        OR: [{ senderId: userId }, { recipientId: userId }],
        status: "voted"
      },
      include: {
        sender: { select: { username: true, id: true } },
        recipient: { select: { username: true, id: true } },
        session: true
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit
    });

    const matches = await Promise.all(
      sharedSessions.map(async (sharedSession) => {
        const completed = await this.completePreview(sharedSession.id, sharedSession.session.mealType, userId, sharedSession);
        return completed;
      })
    );

    return { matches };
  },

  async listInbox(userId: string) {
    const sessions = await prisma.sharedSession.findMany({
      where: {
        OR: [{ recipientId: userId }, { recipientId: null, senderId: { not: userId } }]
      },
      include: {
        sender: { select: { username: true } }
      },
      orderBy: { createdAt: "desc" }
    });

    return {
      sharedSessions: sessions.map((item) => ({
        id: item.id,
        shareCode: item.shareCode,
        status: item.status,
        sender: item.sender,
        createdAt: item.createdAt,
        votedAt: item.votedAt
      }))
    };
  },

  async completePreview(sharedSessionId: string, mealType: string | null, userId: string, sharedSession: {
    id: string;
    sender: { id: string; username: string };
    recipient: { id: string; username: string } | null;
    createdAt: Date;
  }) {
    const [senderLikes, partnerLikes] = await Promise.all([
      prisma.swipeVote.findMany({
        where: { session: { shares: { some: { id: sharedSessionId } } }, vote: "like" },
        select: { dishId: true }
      }),
      prisma.partnerVote.findMany({
        where: { sharedSessionId, vote: "like" },
        select: { dishId: true }
      })
    ]);

    const ids = senderLikes
      .map((vote) => vote.dishId)
      .filter((dishId) => partnerLikes.some((partnerVote) => partnerVote.dishId === dishId));
    const dishes = await prisma.dish.findMany({ where: { id: { in: ids } }, include: dishInclude });
    const partner = sharedSession.sender.id === userId ? sharedSession.recipient : sharedSession.sender;

    return {
      sharedSessionId,
      partner: { username: partner?.username ?? "Партнёр" },
      mealType,
      date: sharedSession.createdAt,
      matchedDishes: dishes.map(mapDish),
      matchCount: dishes.length
    };
  },

  async getMatchResult(userId: string, sharedSessionId: string) {
    const sharedSession = await prisma.sharedSession.findFirst({
      where: {
        id: sharedSessionId,
        OR: [{ senderId: userId }, { recipientId: userId }]
      },
      include: {
        sender: { select: { id: true, username: true } },
        recipient: { select: { id: true, username: true } },
        session: true
      }
    });

    if (!sharedSession) {
      throw new NotFoundError("Результат матча не найден");
    }

    return this.completePreview(sharedSession.id, sharedSession.session.mealType, userId, sharedSession);
  }
};
