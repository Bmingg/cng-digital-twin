import { z } from "zod";

export const GetResourcesOrders$Params = z.object({
  date: z.string().optional(),
  status: z.string().optional(),
  customer_id: z.number().optional(),
});
export type GetResourcesOrders$Params = z.infer<
  typeof GetResourcesOrders$Params
>;

export const GetResourcesOrders$Result = z
  .object({
    customer_id: z.number(),
    required_volume: z.number(),
    delivery_time: z.string(),
    priority_level: z.number(),
    id: z.string(),
    status: z.string(),
  })
  .array();
export type GetResourcesOrders$Result = z.infer<
  typeof GetResourcesOrders$Result
>;
