import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TabBar } from "../../components/TabBar";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Loader } from "../../components/ui/Loader";
import { useProfile, useUpdateProfile } from "../../hooks/useAuth";
import { authStore } from "../../stores/authStore";
import { profileSchema } from "../../utils/validation";

type FormValues = { username: string };

export const Profile = () => {
  const { data, isLoading } = useProfile();
  const mutation = useUpdateProfile();
  const logout = authStore((state) => state.logout);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(profileSchema),
    values: { username: data?.username ?? "" }
  });

  if (isLoading || !data) {
    return <Loader />;
  }

  return (
    <main className="mx-auto min-h-screen max-w-[430px] px-4 pb-24 pt-8">
      <div className="mx-auto mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-secondary/30 text-3xl font-bold text-primary">
        {data.username.slice(0, 1).toUpperCase()}
      </div>
      <form
        className="space-y-4"
        onSubmit={handleSubmit(async (values) => {
          await mutation.mutateAsync(values);
        })}
      >
        <Input label="Username" error={errors.username?.message} {...register("username")} />
        <Input label="Email" value={data.email} readOnly />
        <Button type="submit" fullWidth>
          Редактировать профиль
        </Button>
        <Button type="button" variant="danger" fullWidth onClick={logout}>
          Выйти
        </Button>
      </form>
      <TabBar />
    </main>
  );
};
