import axios from "axios";
import { API_URL } from "../utils/constants";
import { authStore } from "../stores/authStore";

export const apiClient = axios.create({
  baseURL: API_URL
});

apiClient.interceptors.request.use((config) => {
  const token = authStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
