import { prisma } from "../lib/prisma.js";
import { ConflictError, UnauthorizedError } from "../utils/errors.js";
import { comparePassword, hashPassword } from "../utils/hash.js";

const userSelect = {
  id: true,
  email: true,
  username: true,
  avatarUrl: true
} as const;

export const authService = {
  async register(input: { email: string; password: string; username: string }) {
    const [emailUser, usernameUser] = await Promise.all([
      prisma.user.findUnique({ where: { email: input.email } }),
      prisma.user.findUnique({ where: { username: input.username } })
    ]);

    if (emailUser) {
      throw new ConflictError("Email уже занят");
    }

    if (usernameUser) {
      throw new ConflictError("Username уже занят");
    }

    const password = await hashPassword(input.password);
    return prisma.user.create({
      data: {
        email: input.email,
        username: input.username,
        password
      },
      select: userSelect
    });
  },

  async login(input: { email: string; password: string }) {
    const user = await prisma.user.findUnique({ where: { email: input.email } });

    if (!user) {
      throw new UnauthorizedError("Неверный email или пароль");
    }

    const isValid = await comparePassword(input.password, user.password);

    if (!isValid) {
      throw new UnauthorizedError("Неверный email или пароль");
    }

    return {
      id: user.id,
      email: user.email,
      username: user.username,
      avatarUrl: user.avatarUrl
    };
  },

  async isUsernameAvailable(username: string) {
    const user = await prisma.user.findUnique({ where: { username } });
    return !user;
  }
};
