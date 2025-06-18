import { z } from "zod";

export const CreateOrders$Params = z.object({
  customer_id: z.number(),
  required_volume: z.number(),
  delivery_time: z.string(),
  priority_level: z.number(),
  id: z.string().optional(),
  status: z.string().optional(),
});
export type CreateOrders$Params = z.infer<typeof CreateOrders$Params>;

export const CreateOrders$Result = CreateOrders$Params;
export type CreateOrders$Result = CreateOrders$Params;
