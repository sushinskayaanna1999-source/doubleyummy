import { z } from "zod";

export const shareCodeSchema = z.object({
  shareCode: z.string().min(1).max(20)
});

export const partnerVoteSchema = z.object({
  dishId: z.string().uuid(),
  vote: z.enum(["like", "dislike"])
});
