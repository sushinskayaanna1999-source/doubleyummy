import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { useRegister } from "../../hooks/useAuth";
import { authApi } from "../../api/auth";
import { registerSchema } from "../../utils/validation";

type FormValues = { email: string; username: string; password: string; confirmPassword: string };

export const Register = () => {
  const navigate = useNavigate();
  const mutation = useRegister();
  const [usernameAvailable, setUsernameAvailable] = React.useState<boolean | null>(null);
  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(registerSchema)
  });
  const username = watch("username");

  React.useEffect(() => {
    const timer = setTimeout(async () => {
      if (!username || username.length < 3) {
        setUsernameAvailable(null);
        return;
      }
      try {
        const result = await authApi.checkUsername(username);
        setUsernameAvailable(result.available);
      } catch {
        setUsernameAvailable(null);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [username]);

  return (
    <main className="mx-auto flex min-h-screen max-w-[430px] items-center px-4 py-8">
      <Card className="w-full space-y-5 p-6">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Yummy</p>
          <h1 className="mt-3 text-3xl font-bold">Создать аккаунт</h1>
        </div>
        <form
          className="space-y-4"
          onSubmit={handleSubmit(async ({ confirmPassword, ...values }) => {
            await mutation.mutateAsync(values);
            navigate("/");
          })}
        >
          <Input label="Email" error={errors.email?.message} {...register("email")} />
          <Input
            label="Username"
            error={errors.username?.message ?? (usernameAvailable === false ? "Username занят" : undefined)}
            {...register("username")}
          />
          {usernameAvailable ? <p className="text-xs text-success">Username свободен</p> : null}
          <Input label="Пароль" type="password" error={errors.password?.message} {...register("password")} />
          <Input label="Повторите пароль" type="password" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
          <Button type="submit" fullWidth disabled={mutation.isPending || usernameAvailable === false}>
            Создать аккаунт
          </Button>
        </form>
        <p className="text-center text-sm text-textLight">
          Уже есть аккаунт? <Link className="text-primary" to="/auth/login">Войти</Link>
        </p>
      </Card>
    </main>
  );
};
