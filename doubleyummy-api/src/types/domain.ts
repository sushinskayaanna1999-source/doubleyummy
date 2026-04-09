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
