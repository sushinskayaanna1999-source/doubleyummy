import React, { type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Dish } from "../types";
import { CUISINE_TYPE_LABELS, CUISINE_TYPES, MEAL_TYPE_LABELS, MEAL_TYPES, MOOD_TAG_LABELS, MOOD_TAGS } from "../types";
import { dishSchema } from "../utils/validation";
import { Button } from "./ui/Button";
import { Chip } from "./ui/Chip";
import { Input } from "./ui/Input";
import { TextArea } from "./ui/TextArea";
import { ImageUploader } from "./ImageUploader";
import { SERVER_URL } from "../utils/constants";

type FormValues = {
  title: string;
  mealTypes: string[];
  cuisineType: string | null;
  tags: string[];
  description: string | null;
  recipeUrl: string | null;
  recipeText: string | null;
};

export const DishForm: FC<{
  initialDish?: Dish;
  submitLabel: string;
  onSubmit: (values: FormValues & { photos: File[] }) => Promise<void> | void;
  onDelete?: () => void;
}> = ({ initialDish, submitLabel, onSubmit, onDelete }) => {
  const [photos, setPhotos] = React.useState<File[]>([]);
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(dishSchema),
    defaultValues: {
      title: initialDish?.title ?? "",
      mealTypes: initialDish?.mealTypes ?? [],
      cuisineType: initialDish?.cuisineType ?? null,
      tags: initialDish?.tags ?? [],
      description: initialDish?.description ?? null,
      recipeUrl: initialDish?.recipeUrl ?? null,
      recipeText: initialDish?.recipeText ?? null
    }
  });

  const mealTypes = watch("mealTypes");
  const tags = watch("tags");
  const cuisineType = watch("cuisineType");

  return (
    <form className="space-y-5" onSubmit={handleSubmit(async (values) => onSubmit({ ...values, photos }))}>
      <ImageUploader files={photos} previews={initialDish?.media.map((item) => `${SERVER_URL}${item.url}`)} onChange={setPhotos} />
      <Input label="Название" error={errors.title?.message} {...register("title")} />
      <div className="space-y-2">
        <p className="text-sm font-medium">Тип приёма пищи</p>
        <div className="flex flex-wrap gap-2">
          {MEAL_TYPES.map((type) => (
            <Chip
              key={type}
              selected={mealTypes.includes(type)}
              onClick={() =>
                setValue(
                  "mealTypes",
                  mealTypes.includes(type) ? mealTypes.filter((item) => item !== type) : [...mealTypes, type]
                )
              }
            >
              {MEAL_TYPE_LABELS[type]}
            </Chip>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Тип кухни</p>
        <div className="flex flex-wrap gap-2">
          {CUISINE_TYPES.map((type) => (
            <Chip key={type} selected={cuisineType === type} onClick={() => setValue("cuisineType", cuisineType === type ? null : type)}>
              {CUISINE_TYPE_LABELS[type]}
            </Chip>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Настроение</p>
        <div className="flex flex-wrap gap-2">
          {MOOD_TAGS.map((tag) => (
            <Chip
              key={tag}
              selected={tags.includes(tag)}
              onClick={() => setValue("tags", tags.includes(tag) ? tags.filter((item) => item !== tag) : [...tags, tag])}
            >
              {MOOD_TAG_LABELS[tag]}
            </Chip>
          ))}
        </div>
      </div>
      <TextArea label="Описание" rows={3} {...register("description")} />
      <Input label="Ссылка на рецепт" {...register("recipeUrl")} />
      <TextArea label="Текст рецепта" rows={6} {...register("recipeText")} />
      <Button type="submit" fullWidth disabled={isSubmitting}>
        {submitLabel}
      </Button>
      {onDelete ? (
        <Button type="button" variant="danger" fullWidth onClick={onDelete}>
          Удалить блюдо
        </Button>
      ) : null}
    </form>
  );
};
