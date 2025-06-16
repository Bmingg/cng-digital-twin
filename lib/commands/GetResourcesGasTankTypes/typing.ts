import { z } from "zod";

export const GetResourcesGasTankTypes$Params = z.object({
  limit: z.number().optional().default(100),
  skip: z.number().optional().default(0),
});
export type GetResourcesGasTankTypes$Params = z.infer<
  typeof GetResourcesGasTankTypes$Params
>;

export const GetResourcesGasTankTypes$Result = z
  .object({
    id: z.string(),
    count: z.number(),
    vmax: z.number(),
    owned: z.string(),
    rental_cost_by_hour: z.number(),
    loading_time: z.number(),
  })
  .array();
export type GetResourcesGasTankTypes$Result = z.infer<
  typeof GetResourcesGasTankTypes$Result
>;
