import React from "react";
import { Link } from "react-router-dom";
import { TabBar } from "../../components/TabBar";
import { Card } from "../../components/ui/Card";
import { EmptyState } from "../../components/ui/EmptyState";
import { Loader } from "../../components/ui/Loader";
import { useInbox, useMatches } from "../../hooks/useMatches";
import { useSessions } from "../../hooks/useSwipeSession";

export const Collections = () => {
  const [tab, setTab] = React.useState<"mine" | "incoming">("mine");
  const sessionsQuery = useSessions();
  const matchesQuery = useMatches();
  const inboxQuery = useInbox();

  return (
    <main className="mx-auto min-h-screen max-w-[430px] px-4 pb-24 pt-6">
      <h1 className="mb-5 text-3xl font-bold">Подборки</h1>
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl bg-white p-1 shadow-card">
        <button className={`rounded-2xl px-4 py-3 text-sm font-semibold ${tab === "mine" ? "bg-primary text-white" : ""}`} onClick={() => setTab("mine")}>
          Мои подборки
        </button>
        <button className={`rounded-2xl px-4 py-3 text-sm font-semibold ${tab === "incoming" ? "bg-primary text-white" : ""}`} onClick={() => setTab("incoming")}>
          Входящие
        </button>
      </div>

      {tab === "mine" ? (
        sessionsQuery.isLoading ? (
          <Loader />
        ) : sessionsQuery.data?.sessions.length ? (
          <div className="space-y-3">
            {sessionsQuery.data.sessions.map((session) => (
              <Link key={session.id} to={`/swipe/result/${session.id}`}>
                <Card>
                  <p className="text-sm text-textLight">{new Date(session.createdAt).toLocaleDateString("ru-RU")}</p>
                  <h3 className="mt-2 font-semibold">Лайков: {session.likesCount ?? 0}</h3>
                  <p className="text-sm text-textLight">{session.hasShared ? "Поделились с партнёром" : "Ещё не делились"}</p>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState title="Пока нет подборок" description="Начните свайпить!" />
        )
      ) : inboxQuery.isLoading || matchesQuery.isLoading ? (
        <Loader />
      ) : inboxQuery.data?.sharedSessions.length || matchesQuery.data?.matches.length ? (
        <div className="space-y-3">
          {inboxQuery.data?.sharedSessions.map((item) => (
            <Link key={item.id} to={item.status === "voted" ? `/collections/match/${item.id}` : `/collections/shared/${item.shareCode}`}>
              <Card>
                <h3 className="font-semibold">@{item.sender.username}</h3>
                <p className="mt-2 text-sm text-textLight">{item.status === "voted" ? "Голосование завершено" : "Новая подборка ждёт голос"}</p>
              </Card>
            </Link>
          ))}
          {matchesQuery.data.matches.map((match) => (
            <Link key={match.sharedSessionId} to={`/collections/match/${match.sharedSessionId}`}>
              <Card>
                <h3 className="font-semibold">@{match.partner.username}</h3>
                <p className="mt-2 text-sm text-textLight">Совпадений: {match.matchCount}</p>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState title="Пока нет входящих" description="Как только партнёр проголосует, результаты появятся здесь." />
      )}
      <TabBar />
    </main>
  );
};
