import { Link, useParams, useNavigate } from "react-router-dom";
import { PhotoGallery } from "../../components/PhotoGallery";
import { Badge } from "../../components/ui/Badge";
import { Loader } from "../../components/ui/Loader";
import { useDish } from "../../hooks/useDishes";
import { CUISINE_TYPE_LABELS, MEAL_TYPE_LABELS, MOOD_TAG_LABELS } from "../../types";
import { SERVER_URL } from "../../utils/constants";

export const DishDetail = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useDish(id);

  if (isLoading || !data) {
    return <Loader />;
  }

  const dish = data.dish;

  return (
    <main className="mx-auto min-h-screen max-w-[430px] px-4 pb-10 pt-6">
      <div className="mb-4 flex justify-between items-center">
        <button onClick={() => navigate("/library")} className="rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-card">
          ← 
        </button>
        <Link to={`/library/edit/${dish.id}`} className="rounded-full bg-white px-4 py-2 text-sm font-semibold shadow-card">
          ✏️ Редактировать
        </Link>
      </div>
      <PhotoGallery photos={dish.media.map((item) => `${SERVER_URL}${item.url}`)} title={dish.title} />
      <h1 className="mt-5 text-3xl font-bold">{dish.title}</h1>
      <div className="mt-3 flex flex-wrap gap-2">
        {dish.cuisineType ? <Badge>{CUISINE_TYPE_LABELS[dish.cuisineType]}</Badge> : null}
        {dish.mealTypes.map((mealType) => <Badge key={mealType}>{MEAL_TYPE_LABELS[mealType]}</Badge>)}
        {dish.tags.map((tag) => <Badge key={tag}>{MOOD_TAG_LABELS[tag]}</Badge>)}
      </div>
      {dish.description ? <p className="mt-5 text-textLight">{dish.description}</p> : null}
      {dish.recipeText ? (
        <section className="mt-6">
          <h2 className="mb-2 text-lg font-semibold">Рецепт</h2>
          <p className="whitespace-pre-wrap text-sm leading-6 text-textLight">{dish.recipeText}</p>
        </section>
      ) : null}
      {dish.recipeUrl ? (
        <a href={dish.recipeUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex rounded-button bg-primary px-4 py-3 font-semibold text-white">
          Открыть рецепт →
        </a>
      ) : null}
    </main>
  );
};
