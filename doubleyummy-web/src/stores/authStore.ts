import { create } from "zustand";
import type { User } from "../types";

type AuthState = {
  token: string | null;
  user: User | null;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
};

const storedToken = localStorage.getItem("doubleyummy-token");
const storedUser = localStorage.getItem("doubleyummy-user");

export const authStore = create<AuthState>((set) => ({
  token: storedToken,
  user: storedUser ? (JSON.parse(storedUser) as User) : null,
  setAuth: (token, user) => {
    localStorage.setItem("doubleyummy-token", token);
    localStorage.setItem("doubleyummy-user", JSON.stringify(user));
    set({ token, user });
  },
  logout: () => {
    localStorage.removeItem("doubleyummy-token");
    localStorage.removeItem("doubleyummy-user");
    set({ token: null, user: null });
  }
}));
