import { z } from "zod";

export const CreateTruckTypes$Params = z.object({
  id: z.string(),
  count: z.number(),
  vmax: z.number(),
  owned: z.string(),
  rental_cost_by_hour: z.number(),
});
export type CreateTruckTypes$Params = z.infer<typeof CreateTruckTypes$Params>;

export const CreateTruckTypes$Result = CreateTruckTypes$Params;
export type CreateTruckTypes$Result = CreateTruckTypes$Params;
