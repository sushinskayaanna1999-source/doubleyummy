import { apiClient } from "./client";
import type { Dish } from "../types";

export type DishListParams = {
  meal_type?: string;
  cuisine_type?: string;
  tags?: string;
  search?: string;
  page?: number;
  limit?: number;
};

const toFormData = (payload: Record<string, unknown>) => {
  const form = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") {
      return;
    }
    if (Array.isArray(value)) {
      form.append(key, value.join(","));
      return;
    }
    if (value instanceof File) {
      form.append(key, value);
      return;
    }
    if (value instanceof Blob) {
      form.append(key, value);
      return;
    }
    form.append(key, String(value));
  });
  return form;
};

export const dishesApi = {
  list: async (params: DishListParams) =>
    (await apiClient.get<{ dishes: Dish[]; total: number; page: number; totalPages: number }>("/dishes", { params })).data,
  getById: async (id: string) => (await apiClient.get<{ dish: Dish }>(`/dishes/${id}`)).data,
  create: async (payload: Record<string, unknown> & { photos: File[] }) => {
    const form = toFormData({ ...payload });
    payload.photos.forEach((photo) => form.append("photos", photo));
    return (await apiClient.post<{ dish: Dish }>("/dishes", form)).data;
  },
  update: async (id: string, payload: Record<string, unknown> & { newPhotos?: File[] }) => {
    const form = toFormData({ ...payload });
    payload.newPhotos?.forEach((photo) => form.append("newPhotos", photo));
    return (await apiClient.put<{ dish: Dish }>(`/dishes/${id}`, form)).data;
  },
  remove: async (id: string) => (await apiClient.delete<{ success: true }>(`/dishes/${id}`)).data
};
