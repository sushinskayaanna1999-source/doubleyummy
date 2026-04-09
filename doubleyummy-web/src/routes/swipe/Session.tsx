import React from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { SwipeDeck } from "../../components/SwipeDeck";
import { TopBar } from "../../components/TopBar";
import { useCompleteSession, useSession, useVoteSession } from "../../hooks/useSwipeSession";
import { swipeStore } from "../../stores/swipeStore";
import type { Dish } from "../../types";

export const Session = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const voteMutation = useVoteSession();
  const completeMutation = useCompleteSession();
  const sessionQuery = useSession(id);
  const { dishes, currentIndex, setSession, advance } = swipeStore();

  React.useEffect(() => {
    const incoming = (location.state as { dishes?: Dish[] } | null)?.dishes;
    if (incoming?.length) {
      setSession(id, incoming);
    } else if (sessionQuery.data?.likes !== undefined && dishes.length === 0) {
      setSession(id, []);
    }
  }, [location.state, sessionQuery.data, dishes.length, id, setSession]);

  const handleVote = async (dish: Dish, vote: "like" | "dislike") => {
    await voteMutation.mutateAsync({ id, dishId: dish.id, vote });
    advance();
  };

  const currentDish = dishes[currentIndex];

  return (
    <main className="mx-auto min-h-screen max-w-[430px] px-4 pb-10 pt-4">
      <TopBar
        title="Свайпы"
        right={
          <button
            className="text-sm font-medium text-primary"
            onClick={async () => {
              await completeMutation.mutateAsync(id);
              navigate(`/swipe/result/${id}`);
            }}
          >
            Завершить
          </button>
        }
      />
      {currentDish ? (
        <>
          <SwipeDeck dishes={dishes} currentIndex={currentIndex} onVote={handleVote} onOpen={(dishId) => navigate(`/library/dish/${dishId}`)} />
          <div className="mt-6 flex justify-center gap-4">
            <Button variant="ghost" className="h-16 w-16 rounded-full text-2xl" onClick={() => currentDish && handleVote(currentDish, "dislike")}>
              ✗
            </Button>
            <Button className="h-16 w-16 rounded-full text-2xl" onClick={() => currentDish && handleVote(currentDish, "like")}>
              ❤️
            </Button>
          </div>
        </>
      ) : (
        <div className="pt-16">
          <EmptyState
            title="Вы просмотрели все блюда!"
            description="Добавьте больше блюд в библиотеку или посмотрите итог этой сессии."
            action={
              <div className="space-y-3">
                <Button fullWidth onClick={() => navigate(`/swipe/result/${id}`)}>Посмотреть результат</Button>
                <Button fullWidth variant="ghost" onClick={() => navigate("/library")}>В библиотеку</Button>
              </div>
            }
          />
        </div>
      )}
    </main>
  );
};
