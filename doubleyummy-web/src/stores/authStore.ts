import { create } from "zustand";
import type { User } from "../types";

type AuthState = {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
};

const storedToken = localStorage.getItem("Yummy-token");
const storedUser = localStorage.getItem("Yummy-user");

export const authStore = create<AuthState>((set) => ({
  token: storedToken,
  user: storedUser ? (JSON.parse(storedUser) as User) : null,
  setAuth: (token, user) => {
    localStorage.setItem("Yummy-token", token);
    localStorage.setItem("Yummy-user", JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem("Yummy-token");
    localStorage.removeItem("Yummy-user");
    set({ token: null, user: null });
  }
}));
