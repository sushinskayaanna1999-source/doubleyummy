import { useNavigate, useParams } from "react-router-dom";
import { DishForm } from "../../components/DishForm";
import { Loader } from "../../components/ui/Loader";
import { TopBar } from "../../components/TopBar";
import { useDeleteDish, useDish, useUpdateDish } from "../../hooks/useDishes";

export const EditDish = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useDish(id);
  const updateMutation = useUpdateDish();
  const deleteMutation = useDeleteDish();

  if (isLoading || !data) {
    return <Loader />;
  }

  return (
    <main className="mx-auto min-h-screen max-w-[430px] px-4 pb-10 pt-4">
      <TopBar title="Редактировать" left={<button onClick={() => navigate(-1)}>←</button>} />
      <DishForm
        initialDish={data.dish}
        submitLabel="Сохранить изменения"
        onSubmit={async (values) => {
          await updateMutation.mutateAsync({
            id,
            payload: {
              ...values,
              newPhotos: values.photos
            }
          });
          navigate(`/library/dish/${id}`);
        }}
        onDelete={async () => {
          await deleteMutation.mutateAsync(id);
          navigate("/library");
        }}
      />
    </main>
  );
};
