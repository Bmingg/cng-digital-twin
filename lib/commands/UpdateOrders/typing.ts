import { z } from "zod";

export const UpdateOrders$Params = z.object({
  id: z.string(),
  required_volume: z.number(),
  delivery_time: z.string(),
  priority_level: z.number(),
  status: z.string(),
});
export type UpdateOrders$Params = z.infer<typeof UpdateOrders$Params>;

export const UpdateOrders$Result = UpdateOrders$Params;
export type UpdateOrders$Result = UpdateOrders$Params;
