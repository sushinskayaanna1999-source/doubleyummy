import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/", label: "🏠 Главная" },
  { to: "/library", label: "📚 Библиотека" },
  { to: "/collections", label: "💑 Подборки" },
  { to: "/profile", label: "👤 Профиль" }
];

export const TabBar = () => (
  <nav className="fixed bottom-0 left-0 right-0 z-40 mx-auto flex h-14 w-full max-w-[430px] border-t border-border bg-white/95 px-2 backdrop-blur">
    {tabs.map((tab) => (
      <NavLink
        key={tab.to}
        to={tab.to}
        className={({ isActive }) =>
          `flex flex-1 items-center justify-center rounded-xl text-xs font-semibold ${isActive ? "text-primary" : "text-textLight"}`
        }
      >
        {tab.label}
      </NavLink>
    ))}
  </nav>
);
