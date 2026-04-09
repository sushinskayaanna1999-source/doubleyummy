import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { DishCard } from "../../components/DishCard";
import { Button } from "../../components/ui/Button";
import { EmptyState } from "../../components/ui/EmptyState";
import { Loader } from "../../components/ui/Loader";
import { Modal } from "../../components/ui/Modal";
import { useSession, useShareSession } from "../../hooks/useSwipeSession";

export const Result = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useSession(id);
  const shareMutation = useShareSession();
  const [shareUrl, setShareUrl] = React.useState("");

  if (isLoading) {
    return <Loader />;
  }

  const likes = data?.likes ?? [];

  return (
    <main className="mx-auto min-h-screen max-w-[430px] px-4 pb-10 pt-6">
      <header className="mb-6">
        <button onClick={() => navigate("/")} className="mb-3 rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-card">
          ← 
        </button>
        <h1 className="text-3xl font-bold">Твои выборы</h1>
        <p className="mt-2 text-sm text-textLight">Понравилось: {likes.length}</p>
      </header>
      {likes.length ? (
        <div className="grid grid-cols-2 gap-3">
          {likes.map((dish) => <DishCard key={dish.id} dish={dish} />)}
        </div>
      ) : (
        <EmptyState
          title="Ничего не приглянулось 😅"
          description="Попробуйте снова с другими фильтрами."
          action={<Button onClick={() => navigate("/")}>Попробовать снова</Button>}
        />
      )}
      <div className="mt-6 space-y-3">
        <Button
          fullWidth
          onClick={async () => {
            const result = await shareMutation.mutateAsync(id);
            setShareUrl(result.shareUrl);
          }}
        >
          📤 Поделиться с партнёром
        </Button>
        <Button fullWidth variant="ghost" onClick={() => navigate("/collections")}>
          ✓ Выбрать самому
        </Button>
      </div>
      <Modal open={Boolean(shareUrl)} onClose={() => setShareUrl("")} title="Поделиться подборкой">
        <div className="space-y-3">
          <p className="rounded-2xl bg-background p-3 text-sm">{shareUrl}</p>
          <Button
            fullWidth
            onClick={async () => {
              if (navigator.share) {
                await navigator.share({ url: shareUrl, title: "DoubleYummy" });
              } else {
                await navigator.clipboard.writeText(shareUrl);
              }
            }}
          >
            Копировать ссылку
          </Button>
        </div>
      </Modal>
    </main>
  );
};
