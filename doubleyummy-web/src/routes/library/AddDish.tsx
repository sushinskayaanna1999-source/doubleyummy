import { useNavigate } from "react-router-dom";
import { DishForm } from "../../components/DishForm";
import { TopBar } from "../../components/TopBar";
import { useCreateDish } from "../../hooks/useDishes";

export const AddDish = () => {
  const navigate = useNavigate();
  const mutation = useCreateDish();

  return (
    <main className="mx-auto min-h-screen max-w-[430px] px-4 pb-10 pt-4">
      <TopBar title="Новое блюдо" left={<button onClick={() => navigate(-1)}>←</button>} />
      <DishForm
        submitLabel="Сохранить"
        onSubmit={async (values) => {
          await mutation.mutateAsync({
            ...values,
            mealTypes: values.mealTypes,
            tags: values.tags,
            photos: values.photos
          });
          navigate("/library");
        }}
      />
    </main>
  );
};
