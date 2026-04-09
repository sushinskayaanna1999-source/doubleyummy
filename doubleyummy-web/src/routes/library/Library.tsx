import React from "react";
import { Link } from "react-router-dom";
import { DishCard } from "../../components/DishCard";
import { TabBar } from "../../components/TabBar";
import { EmptyState } from "../../components/ui/EmptyState";
import { Input } from "../../components/ui/Input";
import { Loader } from "../../components/ui/Loader";
import { useDishes } from "../../hooks/useDishes";

export const Library = () => {
  const [search, setSearch] = React.useState("");
  const { data, isLoading } = useDishes({ search, page: 1, limit: 20 });

  return (
    <main className="mx-auto min-h-screen max-w-[430px] px-4 pb-24 pt-6">
      <header className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Мои блюда</h1>
        </div>
        <Link to="/library/add" className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-2xl text-white">
          +
        </Link>
      </header>
      <Input placeholder="Поиск по названию" value={search} onChange={(event) => setSearch(event.target.value)} />
      {isLoading ? <Loader /> : null}
      {data?.dishes.length ? (
        <div className="mt-5 grid grid-cols-2 gap-3">
          {data.dishes.map((dish) => <DishCard key={dish.id} dish={dish} />)}
        </div>
      ) : !isLoading ? (
        <div className="mt-6">
          <EmptyState
            title="Добавьте своё первое блюдо!"
            description="Соберите библиотеку рецептов и начните свайпить."
            action={<Link to="/library/add" className="text-primary">Перейти к добавлению</Link>}
          />
        </div>
      ) : null}
      <TabBar />
    </main>
  );
};
