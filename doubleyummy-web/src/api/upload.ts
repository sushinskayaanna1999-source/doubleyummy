import { apiClient } from "./client";

export const uploadApi = {
  image: async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    return (await apiClient.post<{ url: string }>("/upload/image", form)).data;
  }
};
