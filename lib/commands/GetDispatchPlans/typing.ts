import { date, z } from "zod";

export const GetDispatchPlans$Params = z.object({
  start_date: z.string(),
});
export type GetDispatchPlans$Params = z.infer<
  typeof GetDispatchPlans$Params
>;

export const GetDispatchPlans$Result = z
  .object({
    date: z.string(),
    is_auto_generated: z.boolean(),
    id: z.string(),
    status: z.string(),
    optimization_error: z.string().optional(),
    total_cost: z.number(),
    total_distance: z.number(),
    total_order_completed: z.number(),
    total_order_incomplete: z.number(),
    total_volume_delivered: z.number(),
    assignments: z.object({}),
  })
  .array();

export type GetDispatchPlans$Result = z.infer<
  typeof GetDispatchPlans$Result
>;
