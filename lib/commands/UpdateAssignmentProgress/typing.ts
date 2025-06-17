import { z } from "zod";

export const UpdateAssignmentProgress$Params = z.object({
  event_time: z.string(),
});
export type UpdateAssignmentProgress$Params = z.infer<
  typeof UpdateAssignmentProgress$Params
>;

export const UpdateAssignmentProgress$Result = z
  .object({
    order_id: z.string(),
    truck_id: z.number(),
    tank_id: z.number(),
    compressor_id: z.number(),
    estimated_start_time: z.string().nullish(),
    estimated_tank_loading_finished: z.string().nullish(),
    estimated_gas_filling_finished: z.string().nullish(),
    estimated_delivery_finished: z.string().nullish(),
    estimated_tank_unloading_finished: z.string().nullish(),
    estimated_end_time: z.string().nullish(),
    id: z.string(),
    plan_id: z.string(),
    status: z.string(),
    actual_start_time: z.string().nullish(),
    actual_tank_loading_finished: z.string().nullish(),
    actual_gas_filling_finished: z.string().nullish(),
    actual_delivery_finished: z.string().nullish(),
    actual_tank_unloading_finished: z.string().nullish(),
    actual_end_time: z.string().nullish(),
  })
  .array();
export type UpdateAssignmentProgress$Result = z.infer<
  typeof UpdateAssignmentProgress$Result
>;
