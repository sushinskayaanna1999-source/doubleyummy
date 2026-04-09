import { useQuery } from "@tanstack/react-query";
import { sharedApi } from "../api/shared";

export const useMatches = () =>
  useQuery({
    queryKey: ["matches"],
    queryFn: () => sharedApi.matches()
  });

export const useInbox = () =>
  useQuery({
    queryKey: ["inbox"],
    queryFn: () => sharedApi.inbox()
  });

export const useMatchResult = (id: string) =>
  useQuery({
    queryKey: ["match", id],
    queryFn: () => sharedApi.result(id),
    enabled: Boolean(id)
  });
