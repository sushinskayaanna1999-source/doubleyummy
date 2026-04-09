import { apiClient } from "./client";
import type { User } from "../types";

export const authApi = {
  register: async (payload: { email: string; password: string; username: string }) =>
    (await apiClient.post<{ token: string; user: User }>("/auth/register", payload)).data,
  login: async (payload: { email: string; password: string }) =>
    (await apiClient.post<{ token: string; user: User }>("/auth/login", payload)).data,
  checkUsername: async (username: string) =>
    (await apiClient.get<{ available: boolean }>(`/auth/check-username/${username}`)).data,
  profile: async () => (await apiClient.get<User>("/profile")).data,
  updateProfile: async (payload: { username: string }) =>
    (await apiClient.put<{ user: User }>("/profile", payload)).data
};
