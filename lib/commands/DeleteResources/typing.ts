import { z } from "zod";

export const DeleteResources$Params = z.object({
  id: z.string(),
});
export type DeleteResources$Params = z.infer<typeof DeleteResources$Params>;
