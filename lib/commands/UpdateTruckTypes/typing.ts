import { z } from "zod";

export const UpdateTruckTypes$Params = z.object({
  id: z.string(),
  count: z.number(),
  vmax: z.number(),
  owned: z.string(),
  rental_cost_by_hour: z.number(),
});
export type UpdateTruckTypes$Params = z.infer<typeof UpdateTruckTypes$Params>;

export const UpdateTruckTypes$Result = UpdateTruckTypes$Params;
export type UpdateTruckTypes$Result = UpdateTruckTypes$Params;
