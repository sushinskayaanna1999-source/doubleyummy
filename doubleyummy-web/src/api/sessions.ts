import { apiClient } from "./client";
import type { Dish, SwipeSession } from "../types";

export const sessionsApi = {
  create: async (payload: {
    mealType: string | null;
    filters: { cuisineTypes: string[] | null; tags: string[] | null };
  }) => (await apiClient.post<{ session: SwipeSession; dishes: Dish[] }>("/sessions", payload)).data,
  vote: async (id: string, payload: { dishId: string; vote: "like" | "dislike" }) =>
    (await apiClient.post<{ success: true }>(`/sessions/${id}/vote`, payload)).data,
  complete: async (id: string) =>
    (await apiClient.post<{ session: SwipeSession; likes: Dish[] }>(`/sessions/${id}/complete`)).data,
  list: async (params?: { page?: number; limit?: number }) =>
    (await apiClient.get<{ sessions: SwipeSession[]; total: number; page: number; totalPages: number }>("/sessions", { params })).data,
  getById: async (id: string) =>
    (await apiClient.get<{ session: SwipeSession; votes: Array<{ dishId: string; vote: string }>; likes: Dish[] }>(`/sessions/${id}`)).data,
  share: async (id: string) =>
    (await apiClient.post<{ sharedSession: { id: string; shareCode: string; status: string }; shareUrl: string }>(`/sessions/${id}/share`)).data
};
