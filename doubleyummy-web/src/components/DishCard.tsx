import type { FC } from "react";
import { Link } from "react-router-dom";
import type { Dish } from "../types";
import { Card } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { MEAL_TYPE_LABELS } from "../types";
import { SERVER_URL } from "../utils/constants";

export const DishCard: FC<{ dish: Dish }> = ({ dish }) => (
  <Link to={`/library/dish/${dish.id}`}>
    <Card className="overflow-hidden p-0">
      <img
        src={dish.media[0]?.url ? `${SERVER_URL}${dish.media[0].url}` : "https://placehold.co/400x520?text=Dish"}
        alt={dish.title}
        className="aspect-[3/4] w-full object-cover"
      />
      <div className="space-y-2 px-0 py-3">
        {dish.mealTypes.length > 0 ? <Badge>{MEAL_TYPE_LABELS[dish.mealTypes[0]]}</Badge> : null}
        <h3 className="line-clamp-2 font-semibold">{dish.title}</h3>
      </div>
    </Card>
  </Link>
);
