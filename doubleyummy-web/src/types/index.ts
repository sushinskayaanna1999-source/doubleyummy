export const MEAL_TYPES = ["breakfast", "lunch", "dinner", "dessert", "snack", "brunch"] as const;
export const CUISINE_TYPES = [
  "russian",
  "italian",
  "asian",
  "georgian",
  "mexican",
  "french",
  "american",
  "mediterranean",
  "indian",
  "japanese",
  "other"
] as const;
export const MOOD_TAGS = [
  "comfort",
  "light",
  "hearty",
  "quick",
  "special",
  "spicy",
  "vegetarian",
  "meat",
  "fish",
  "carbs",
  "high_protein"
] as const;

export type MealType = (typeof MEAL_TYPES)[number];
export type CuisineType = (typeof CUISINE_TYPES)[number];
export type MoodTag = (typeof MOOD_TAGS)[number];

export const MEAL_TYPE_LABELS: Record<MealType, string> = {
  breakfast: "Завтрак",
  lunch: "Обед",
  dinner: "Ужин",
  dessert: "Десерт",
  snack: "Перекус",
  brunch: "Бранч"
};

export const MEAL_TYPE_EMOJIS: Record<MealType, string> = {
  breakfast: "🌅",
  lunch: "☀️",
  dinner: "🌙",
  dessert: "🍰",
  snack: "🥪",
  brunch: "🥂"
};

export const CUISINE_TYPE_LABELS: Record<CuisineType, string> = {
  russian: "Русская",
  italian: "Итальянская",
  asian: "Азиатская",
  georgian: "Грузинская",
  mexican: "Мексиканская",
  french: "Французская",
  american: "Американская",
  mediterranean: "Средиземноморская",
  indian: "Индийская",
  japanese: "Японская",
  other: "Другое"
};

export const MOOD_TAG_LABELS: Record<MoodTag, string> = {
  comfort: "🔥 Тёплое и уютное",
  light: "🥗 Лёгкое и полезное",
  hearty: "🧈 Пожирнее и посытнее",
  quick: "⚡ Быстрое (до 30 мин)",
  special: "🎉 Для особого случая",
  spicy: "🌶️ Острое",
  vegetarian: "🥬 Вегетарианское",
  meat: "🍖 Мясное",
  fish: "🐟 Рыбное",
  carbs: "🍝 С углеводами",
  high_protein: "🏋️ Высокобелковое"
};

export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl: string | null;
}

export interface DishMedia {
  id: string;
  mediaType: "photo";
  url: string;
  sortOrder: number;
}

export interface Dish {
  id: string;
  title: string;
  description: string | null;
  recipeText: string | null;
  recipeUrl: string | null;
  cuisineType: CuisineType | null;
  media: DishMedia[];
  mealTypes: MealType[];
  tags: MoodTag[];
  createdAt: string;
}

export interface SwipeSession {
  id: string;
  mealType: MealType | null;
  filtersJson: { cuisineTypes: CuisineType[] | null; tags: MoodTag[] | null } | null;
  status: "active" | "completed";
  createdAt: string;
  completedAt: string | null;
  likesCount?: number;
  hasShared?: boolean;
}

export interface SharedSession {
  id: string;
  shareCode: string;
  status: "pending" | "voted" | "expired";
  sender: { username: string };
  createdAt: string;
  votedAt: string | null;
}

export interface MatchResult {
  sharedSessionId: string;
  partner: { username: string };
  mealType: MealType | null;
  date: string;
  matchedDishes: Dish[];
  matchCount: number;
}
