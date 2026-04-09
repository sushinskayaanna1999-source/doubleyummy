import type { FC } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import type { Dish } from "../types";
import { Badge } from "./ui/Badge";
import { CUISINE_TYPE_LABELS, MOOD_TAG_LABELS } from "../types";

export const SwipeCard: FC<{
  dish: Dish;
  onVote: (vote: "like" | "dislike") => void;
  onOpen: () => void;
}> = ({ dish, onVote, onOpen }) => {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 300], [-15, 15]);
  const likeOpacity = useTransform(x, [0, 80, 180], [0, 0.4, 1]);
  const dislikeOpacity = useTransform(x, [-180, -80, 0], [1, 0.4, 0]);

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x, rotate }}
      className="absolute inset-0 overflow-hidden rounded-[28px] bg-white shadow-swipe"
      onDragEnd={(_, info) => {
        const threshold = window.innerWidth * 0.3;
        if (info.offset.x > threshold) {
          onVote("like");
        } else if (info.offset.x < -threshold) {
          onVote("dislike");
        }
      }}
      whileTap={{ cursor: "grabbing" }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
    >
      <button type="button" className="relative h-full w-full text-left" onClick={onOpen}>
        <img src={dish.media[0]?.url ?? "https://placehold.co/400x520?text=Dish"} alt={dish.title} className="h-full w-full object-cover" />
        <motion.div style={{ opacity: likeOpacity }} className="absolute left-4 top-4 rounded-2xl bg-success px-4 py-2 text-2xl font-bold text-white">
          ✓
        </motion.div>
        <motion.div style={{ opacity: dislikeOpacity }} className="absolute right-4 top-4 rounded-2xl bg-danger px-4 py-2 text-2xl font-bold text-white">
          ✗
        </motion.div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 text-white">
          <div className="mb-3 flex flex-wrap gap-2">
            {dish.cuisineType ? <Badge>{CUISINE_TYPE_LABELS[dish.cuisineType]}</Badge> : null}
            {dish.tags.slice(0, 2).map((tag) => (
              <Badge key={tag}>{MOOD_TAG_LABELS[tag]}</Badge>
            ))}
          </div>
          <h3 className="text-2xl font-semibold">{dish.title}</h3>
        </div>
      </button>
    </motion.div>
  );
};
