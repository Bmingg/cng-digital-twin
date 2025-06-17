import { z } from "zod";

export const CreateDispatchPlan$Params = z.object({
  date: z.string(),
  is_auto_generated: z.boolean(),
});
export type CreateDispatchPlan$Params = z.infer<
  typeof CreateDispatchPlan$Params
>;

export const CreateDispatchPlan$Result = z.object({
  date: z.string(),
  is_auto_generated: z.boolean(),
  id: z.string(),
  status: z.string(),
  optimization_error: z.string().nullish(),
  total_cost: z.number().nullish(),
  total_distance: z.number().nullish(),
  total_order_completed: z.number().nullish(),
  total_order_incomplete: z.number().nullish(),
  total_volume_delivered: z.number().nullish(),
  assignments: z.any(),
});
export type CreateDispatchPlan$Result = z.infer<
  typeof CreateDispatchPlan$Result
>;
