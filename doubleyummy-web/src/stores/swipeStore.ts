import { create } from "zustand";
import type { Dish } from "../types";

type SwipeStore = {
  sessionId: string | null;
  dishes: Dish[];
  currentIndex: number;
  setSession: (sessionId: string, dishes: Dish[]) => void;
  advance: () => void;
  reset: () => void;
};

export const swipeStore = create<SwipeStore>((set) => ({
  sessionId: null,
  dishes: [],
  currentIndex: 0,
  setSession: (sessionId, dishes) => set({ sessionId, dishes, currentIndex: 0 }),
  advance: () => set((state) => ({ currentIndex: state.currentIndex + 1 })),
  reset: () => set({ sessionId: null, dishes: [], currentIndex: 0 })
}));
