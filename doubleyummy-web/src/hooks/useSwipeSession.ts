import { useMutation, useQuery } from "@tanstack/react-query";
import { sessionsApi } from "../api/sessions";

export const useSession = (id: string) =>
  useQuery({
    queryKey: ["session", id],
    queryFn: () => sessionsApi.getById(id),
    enabled: Boolean(id)
  });

export const useCreateSession = () => useMutation({ mutationFn: sessionsApi.create });
export const useVoteSession = () =>
  useMutation({
    mutationFn: ({ id, dishId, vote }: { id: string; dishId: string; vote: "like" | "dislike" }) =>
      sessionsApi.vote(id, { dishId, vote })
  });
export const useCompleteSession = () =>
  useMutation({
    mutationFn: (id: string) => sessionsApi.complete(id)
  });
export const useSessions = () =>
  useQuery({
    queryKey: ["sessions"],
    queryFn: () => sessionsApi.list()
  });
export const useShareSession = () =>
  useMutation({
    mutationFn: (id: string) => sessionsApi.share(id)
  });
