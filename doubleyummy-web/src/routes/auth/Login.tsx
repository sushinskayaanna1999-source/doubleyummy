import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { useLogin } from "../../hooks/useAuth";
import { loginSchema } from "../../utils/validation";

type FormValues = { email: string; password: string };

export const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mutation = useLogin();
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(loginSchema)
  });

  return (
    <main className="mx-auto flex min-h-screen max-w-[430px] items-center px-4 py-8">
      <Card className="w-full space-y-5 p-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">DoubleYummy</p>
          <h1 className="mt-3 text-3xl font-bold">Войти</h1>
        </div>
        <form
          className="space-y-4"
          onSubmit={handleSubmit(async (values) => {
            await mutation.mutateAsync(values);
            navigate((location.state as { returnTo?: string } | null)?.returnTo ?? "/");
          })}
        >
          <Input label="Email" error={errors.email?.message} {...register("email")} />
          <Input label="Пароль" type="password" error={errors.password?.message} {...register("password")} />
          <Button type="submit" fullWidth disabled={mutation.isPending}>
            Войти
          </Button>
          {mutation.error ? <p className="text-sm text-danger">Не удалось войти</p> : null}
        </form>
        <p className="text-center text-sm text-textLight">
          Нет аккаунта? <Link className="text-primary" to="/auth/register">Зарегистрироваться</Link>
        </p>
      </Card>
    </main>
  );
};
