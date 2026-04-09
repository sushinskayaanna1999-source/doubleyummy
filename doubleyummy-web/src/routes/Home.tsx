import { useNavigate } from "react-router-dom";
import { MealTypeSelector } from "../components/MealTypeSelector";
import { TabBar } from "../components/TabBar";

export const Home = () => {
  const navigate = useNavigate();

  return (
    <main className="mx-auto min-h-screen max-w-[430px] px-4 pb-24 pt-8">
      <header className="mb-8 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">DoubleYummy</p>
        <h1 className="mt-3 text-4xl font-bold">Что готовим?</h1>
      </header>
      <MealTypeSelector onSelect={(mealType) => navigate("/swipe/filters", { state: { mealType } })} />
      <TabBar />
    </main>
  );
};
