import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth";
import { authStore } from "../stores/authStore";

export const useProfile = () =>
  useQuery({
    queryKey: ["profile"],
    queryFn: authApi.profile,
    enabled: Boolean(authStore.getState().token)
  });

export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ token, user }) => {
      authStore.getState().setAuth(token, user);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    }
  });
};

export const useRegister = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.register,
    onSuccess: ({ token, user }) => {
      authStore.getState().setAuth(token, user);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    }
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: authApi.updateProfile,
    onSuccess: ({ user }) => {
      const token = authStore.getState().token;
      if (token) {
        authStore.getState().setAuth(token, user);
      }
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    }
  });
};
