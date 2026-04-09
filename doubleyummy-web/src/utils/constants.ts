import {
  CUISINE_TYPES,
  MEAL_TYPES,
  MOOD_TAGS,
  CUISINE_TYPE_LABELS,
  MEAL_TYPE_LABELS,
  MOOD_TAG_LABELS
} from "../types";

export const APP_NAME = "DoubleYummy";
export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001/api/v1";
export const SERVER_URL = "https://doubleyummy-production.up.railway.app";
export const APP_URL = import.meta.env.VITE_APP_URL ?? "http://localhost:5173";
export const TAB_BAR_HEIGHT = 56;

export const mealTypeOptions = MEAL_TYPES.map((value) => ({
  value,
  label: MEAL_TYPE_LABELS[value]
}));

export const cuisineOptions = CUISINE_TYPES.map((value) => ({
  value,
  label: CUISINE_TYPE_LABELS[value]
}));

export const moodOptions = MOOD_TAGS.map((value) => ({
  value,
  label: MOOD_TAG_LABELS[value]
}));
