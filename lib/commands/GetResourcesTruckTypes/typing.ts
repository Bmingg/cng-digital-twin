import { z } from "zod";

export const GetResourcesTruckTypes$Params = z.object({
  limit: z.number().optional().default(100),
  skip: z.number().optional().default(0),
});
export type GetResourcesTruckTypes$Params = z.infer<
  typeof GetResourcesTruckTypes$Params
>;

export const GetResourcesTruckTypes$Result = z
  .object({
    id: z.string(),
    count: z.number(),
    vmax: z.number(),
    owned: z.string(),
    rental_cost_by_hour: z.number(),
  })
  .array();
export type GetResourcesTruckTypes$Result = z.infer<
  typeof GetResourcesTruckTypes$Result
>;
