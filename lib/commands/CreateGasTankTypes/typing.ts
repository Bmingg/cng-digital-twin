import { z } from "zod";

export const CreateGasTankTypes$Params = z.object({
  id: z.string(),
  count: z.number(),
  vmax: z.number(),
  owned: z.string(),
  rental_cost_by_hour: z.number(),
  loading_time: z.number(),
});
export type CreateGasTankTypes$Params = z.infer<typeof CreateGasTankTypes$Params>;

export const CreateGasTankTypes$Result = CreateGasTankTypes$Params;
export type CreateGasTankTypes$Result = CreateGasTankTypes$Params;
