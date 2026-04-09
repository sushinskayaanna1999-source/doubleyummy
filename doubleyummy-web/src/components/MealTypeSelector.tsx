import type { FC } from "react";
import { MEAL_TYPE_EMOJIS, MEAL_TYPE_LABELS, type MealType } from "../types";
import { Card } from "./ui/Card";

const options: Array<{ value: MealType | null; label: string }> = [
  ...(["breakfast", "lunch", "dinner", "dessert", "snack", "brunch"] as MealType[]).map((value) => ({
    value,
    label: `${MEAL_TYPE_EMOJIS[value]} ${MEAL_TYPE_LABELS[value]}`
  })),
  { value: null, label: "🤷 Не знаю" }
];

export const MealTypeSelector: FC<{ onSelect: (mealType: MealType | null) => void }> = ({ onSelect }) => (
  <div className="grid grid-cols-2 gap-3">
    {options.map((option) => (
      <button
        key={option.label}
        type="button"
        onClick={() => onSelect(option.value)}
        className={option.value === null ? "col-span-2" : ""}
      >
        <Card className={`h-full text-left ${option.value === null ? "bg-secondary/20" : "bg-white"}`}>
          <div className="text-lg font-semibold">{option.label}</div>
        </Card>
      </button>
    ))}
  </div>
);
