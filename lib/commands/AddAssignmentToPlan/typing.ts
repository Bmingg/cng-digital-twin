import { z } from "zod";

export const AddAssignmentToPlan$Params = z.object({
  order_id: z.string(),
  truck_id: z.number(),
  tank_id: z.number(),
  compressor_id: z.number(),
  estimated_start_time: z.string(),
});
export type AddAssignmentToPlan$Params = z.infer<
  typeof AddAssignmentToPlan$Params
>;

export const AddAssignmentToPlan$Result = z.object({
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
});
export type AddAssignmentToPlan$Result = z.infer<
  typeof AddAssignmentToPlan$Result
>;
