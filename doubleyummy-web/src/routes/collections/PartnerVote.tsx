import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SwipeDeck } from "../../components/SwipeDeck";
import { EmptyState } from "../../components/ui/EmptyState";
import { Loader } from "../../components/ui/Loader";
import { TopBar } from "../../components/TopBar";
import { useCompleteSharedSession, useSharedSession, useVoteSharedSession } from "../../hooks/useSharedSession";

export const PartnerVote = () => {
  const { code = "" } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useSharedSession(code);
  const voteMutation = useVoteSharedSession();
  const completeMutation = useCompleteSharedSession();
  const [currentIndex, setCurrentIndex] = React.useState(0);

  if (isLoading || !data) {
    return <Loader />;
  }

  const currentDish = data.dishes[currentIndex];

  return (
    <main className="mx-auto min-h-screen max-w-[430px] px-4 pb-10 pt-4">
      <TopBar title={`Подборка от @${data.sharedSession.sender.username}`} />
      {currentDish ? (
        <SwipeDeck
          dishes={data.dishes}
          currentIndex={currentIndex}
          onVote={async (dish, vote) => {
            await voteMutation.mutateAsync({ code, dishId: dish.id, vote });
            setCurrentIndex((value) => value + 1);
          }}
          onOpen={(dishId) => navigate(`/library/dish/${dishId}`)}
        />
      ) : (
        <div className="pt-16">
          <EmptyState
            title="Голосование завершено"
            description="Можно посмотреть общий результат."
            action={
              <button
                className="rounded-button bg-primary px-4 py-3 font-semibold text-white"
                onClick={async () => {
                  const result = await completeMutation.mutateAsync(code);
                  navigate(`/collections/match/${result.sharedSessionId}`);
                }}
              >
                Посмотреть мэтчи
              </button>
            }
          />
        </div>
      )}
    </main>
  );
};
