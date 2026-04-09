import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { dishesApi, type DishListParams } from "../api/dishes";

export const useDishes = (params: DishListParams) =>
  useQuery({
    queryKey: ["dishes", params],
    queryFn: () => dishesApi.list(params)
  });

export const useDish = (id: string) =>
  useQuery({
    queryKey: ["dish", id],
    queryFn: () => dishesApi.getById(id),
    enabled: Boolean(id)
  });

export const useCreateDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dishesApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dishes"] })
  });
};

export const useUpdateDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Parameters<typeof dishesApi.update>[1] }) =>
      dishesApi.update(id, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
      queryClient.invalidateQueries({ queryKey: ["dish", variables.id] });
    }
  });
};

export const useDeleteDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dishesApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["dishes"] })
  });
};
