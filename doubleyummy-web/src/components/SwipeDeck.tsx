import type { FC } from "react";
import { motion } from "framer-motion";
import type { Dish } from "../types";
import { SwipeCard } from "./SwipeCard";

export const SwipeDeck: FC<{
  dishes: Dish[];
  currentIndex: number;
  onVote: (dish: Dish, vote: "like" | "dislike") => void;
  onOpen: (dishId: string) => void;
}> = ({ dishes, currentIndex, onVote, onOpen }) => {
  const current = dishes[currentIndex];
  const next = dishes[currentIndex + 1];

  return (
    <div className="relative h-[62vh] min-h-[420px]">
      {next ? (
        <motion.div
          key={next.id}
          className="absolute inset-0 scale-95 opacity-90"
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          <img src={next.media[0]?.url ?? "https://placehold.co/400x520?text=Dish"} alt={next.title} className="h-full w-full rounded-[28px] object-cover shadow-card" />
        </motion.div>
      ) : null}
      {current ? (
        <SwipeCard key={current.id} dish={current} onVote={(vote) => onVote(current, vote)} onOpen={() => onOpen(current.id)} />
      ) : null}
    </div>
  );
};
