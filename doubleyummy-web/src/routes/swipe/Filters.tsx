import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { FilterChips } from "../../components/FilterChips";
import { TopBar } from "../../components/TopBar";
import { TabBar } from "../../components/TabBar";
import { useCreateSession } from "../../hooks/useSwipeSession";
import { CUISINE_TYPE_LABELS, MEAL_TYPE_LABELS, MOOD_TAG_LABELS, type CuisineType, type MealType, type MoodTag } from "../../types";

export const Filters = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mutation = useCreateSession();
  const mealType = (location.state as { mealType?: MealType | null } | null)?.mealType ?? null;
  const [cuisineTypes, setCuisineTypes] = React.useState<CuisineType[] | null>(null);
  const [tags, setTags] = React.useState<MoodTag[] | null>(null);

  return (
    <main className="mx-auto min-h-screen max-w-[430px] px-4 pb-24 pt-4">
      <TopBar title={mealType ? MEAL_TYPE_LABELS[mealType] : "Всё подряд"} left={<button onClick={() => navigate(-1)}>←</button>} />
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Тип кухни</h2>
        <FilterChips
          values={Object.entries(CUISINE_TYPE_LABELS).map(([value, label]) => ({ value, label }))}
          selected={cuisineTypes}
          onChange={(next) => setCuisineTypes(next as CuisineType[] | null)}
        />
      </section>
      <section className="mt-8 space-y-3">
        <h2 className="text-lg font-semibold">Настроение</h2>
        <FilterChips
          values={Object.entries(MOOD_TAG_LABELS).map(([value, label]) => ({ value, label }))}
          selected={tags}
          onChange={(next) => setTags(next as MoodTag[] | null)}
        />
      </section>
      <div className="mt-8">
        <Button
          fullWidth
          onClick={async () => {
            const result = await mutation.mutateAsync({ mealType, filters: { cuisineTypes, tags } });
            navigate(`/swipe/session/${result.session.id}`, { state: { dishes: result.dishes } });
          }}
          disabled={mutation.isPending}
        >
          🃏 Начать свайпить
        </Button>
      </div>
      <TabBar />
    </main>
  );
};
