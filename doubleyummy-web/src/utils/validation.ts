import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(8, "Минимум 8 символов")
});

export const registerSchema = loginSchema
  .extend({
    username: z
      .string()
      .min(3, "Минимум 3 символа")
      .max(20, "Максимум 20 символов")
      .regex(/^[a-zA-Z0-9_]+$/, "Только латиница, цифры и underscore"),
    confirmPassword: z.string()
  })
  .refine((value) => value.password === value.confirmPassword, {
    path: ["confirmPassword"],
    message: "Пароли не совпадают"
  });

export const profileSchema = z.object({
  username: z
    .string()
    .min(3, "Минимум 3 символа")
    .max(20, "Максимум 20 символов")
    .regex(/^[a-zA-Z0-9_]+$/, "Только латиница, цифры и underscore")
});

export const dishSchema = z.object({
  title: z.string().min(1, "Введите название").max(100, "Максимум 100 символов"),
  mealTypes: z.array(z.string()).min(1, "Выберите хотя бы один тип приёма пищи"),
  cuisineType: z.string().nullable(),
  tags: z.array(z.string()),
  description: z.string().max(500, "Максимум 500 символов").nullable(),
  recipeUrl: z.union([z.literal(""), z.string().url()]).nullable().optional(),
  recipeText: z.string().max(5000, "Максимум 5000 символов").nullable()
});
