import { z } from "zod";

export const GetResourcesAllOrders$Params = z.object({});
export type GetResourcesAllOrders$Params = z.infer<
  typeof GetResourcesAllOrders$Params
>;

export const GetResourcesAllOrders$Result = z
  .object({
    customer_id: z.number(),
    required_volume: z.number(),
    delivery_time: z.string(),
    priority_level: z.number(),
    id: z.string(),
    status: z.string(),
  })
  .array();
export type GetResourcesAllOrders$Result = z.infer<
  typeof GetResourcesAllOrders$Result
>;
