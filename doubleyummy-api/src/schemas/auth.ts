import { z } from "zod";

export const usernameSchema = z
  .string()
  .min(3)
  .max(20)
  .regex(/^[a-z0-9_]+$/);

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  username: usernameSchema
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
});
