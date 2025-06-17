import { z } from "zod";

export const UpdateGasTankTypes$Params = z.object({
  id: z.string(),
  count: z.number(),
  vmax: z.number(),
  owned: z.string(),
  rental_cost_by_hour: z.number(),
  loading_time: z.number(),
});
export type UpdateGasTankTypes$Params = z.infer<typeof UpdateGasTankTypes$Params>;

export const UpdateGasTankTypes$Result = UpdateGasTankTypes$Params;
export type UpdateGasTankTypes$Result = UpdateGasTankTypes$Params;
