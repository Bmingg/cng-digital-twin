import { date, z } from "zod";

export const GetDispatchPlans$Params = z.object({
  start_date: z.date(),
});
export type GetDispatchPlans$Params = z.infer<typeof GetDispatchPlans$Params>;

export const GetDispatchPlans$Result = z
  .object({
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
    // assignments: z.array({}), // TODO: display somewhere...
  })
  .array();

export type GetDispatchPlans$Result = z.infer<typeof GetDispatchPlans$Result>;
