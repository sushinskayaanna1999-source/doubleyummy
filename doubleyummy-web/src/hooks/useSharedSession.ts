import { useMutation, useQuery } from "@tanstack/react-query";
import { sharedApi } from "../api/shared";

export const useSharedSession = (code: string) =>
  useQuery({
    queryKey: ["shared", code],
    queryFn: () => sharedApi.getByCode(code),
    enabled: Boolean(code)
  });

export const useVoteSharedSession = () =>
  useMutation({
    mutationFn: ({ code, dishId, vote }: { code: string; dishId: string; vote: "like" | "dislike" }) =>
      sharedApi.vote(code, { dishId, vote })
  });

export const useCompleteSharedSession = () =>
  useMutation({
    mutationFn: (code: string) => sharedApi.complete(code)
  });
