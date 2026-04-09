import Confetti from "react-confetti";
import { useNavigate, useParams } from "react-router-dom";
import { Loader } from "../../components/ui/Loader";
import { Button } from "../../components/ui/Button";
import { useMatchResult } from "../../hooks/useMatches";

export const MatchResultPage = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useMatchResult(id);

  if (isLoading || !data) {
    return <Loader />;
  }

  return (
    <main className="mx-auto min-h-screen max-w-[430px] px-4 pb-10 pt-8">
      {data.matchCount > 0 ? <Confetti recycle={false} numberOfPieces={220} /> : null}
      {data.matchCount > 0 ? (
        <>
          <h1 className="text-4xl font-bold">🎉 Мэтч!</h1>
          <p className="mt-2 text-textLight">Вы оба хотите:</p>
          <div className="mt-6 space-y-4">
            {data.matchedDishes.map((dish) => (
              <div key={dish.id} className="flex gap-3 rounded-card bg-white p-3 shadow-card">
                <img src={dish.media[0]?.url ?? "https://placehold.co/200"} alt={dish.title} className="h-24 w-24 rounded-2xl object-cover" />
                <div>
                  <h3 className="font-semibold">{dish.title}</h3>
                  <button className="mt-3 text-sm font-semibold text-primary" onClick={() => navigate(`/library/dish/${dish.id}`)}>
                    Открыть рецепт →
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-lg font-semibold">🍽️ Приятного аппетита!</p>
        </>
      ) : (
        <div className="pt-24 text-center">
          <h1 className="text-3xl font-bold">Увы, совпадений нет 😅</h1>
          <p className="mt-3 text-textLight">Попробуйте ещё раз!</p>
          <Button className="mt-6" onClick={() => navigate("/")}>На главную</Button>
        </div>
      )}
    </main>
  );
};
