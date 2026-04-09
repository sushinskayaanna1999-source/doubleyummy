import { apiClient } from "./client";
import type { Dish, MatchResult, SharedSession } from "../types";

export const sharedApi = {
  getByCode: async (code: string) =>
    (await apiClient.get<{ sharedSession: SharedSession; dishes: Dish[] }>(`/shared/${code}`)).data,
  vote: async (code: string, payload: { dishId: string; vote: "like" | "dislike" }) =>
    (await apiClient.post<{ success: true }>(`/shared/${code}/vote`, payload)).data,
  complete: async (code: string) =>
    (await apiClient.post<{ sharedSessionId: string; matches: Dish[]; totalMatches: number }>(`/shared/${code}/complete`)).data,
  matches: async (params?: { page?: number; limit?: number }) =>
    (await apiClient.get<{ matches: MatchResult[] }>("/matches", { params })).data,
  inbox: async () =>
    (await apiClient.get<{ sharedSessions: SharedSession[] }>("/shared/inbox")).data,
  result: async (id: string) => (await apiClient.get<MatchResult>(`/shared/match/${id}`)).data
};
