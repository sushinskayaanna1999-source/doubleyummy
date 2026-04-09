import type { FC } from "react";
import { Chip } from "./ui/Chip";

export const FilterChips: FC<{
  values: Array<{ value: string; label: string }>;
  selected: string[] | null;
  unknownLabel?: string;
  onChange: (next: string[] | null) => void;
}> = ({ values, selected, onChange, unknownLabel = "🤷 Не знаю / Всё равно" }) => {
  const hasUnknown = selected === null;

  const toggle = (value: string) => {
    if (selected === null) {
      onChange([value]);
      return;
    }
    const exists = selected.includes(value);
    const next = exists ? selected.filter((item) => item !== value) : [...selected, value];
    onChange(next.length ? next : null);
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Chip selected={hasUnknown} onClick={() => onChange(null)}>
        {unknownLabel}
      </Chip>
      {values.map((option) => (
        <Chip key={option.value} selected={selected?.includes(option.value)} onClick={() => toggle(option.value)}>
          {option.label}
        </Chip>
      ))}
    </div>
  );
};
