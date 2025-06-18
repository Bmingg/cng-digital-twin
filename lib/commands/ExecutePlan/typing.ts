import { z } from "zod";

export const ExecutePlan$Params = z.object({
  // No parameters needed for execution
});
export type ExecutePlan$Params = z.infer<
  typeof ExecutePlan$Params
>;

export const ExecutePlan$Result = z.object({
  message: z.string().optional(),
  plan_id: z.string().optional(),
  status: z.string().optional(),
});
export type ExecutePlan$Result = z.infer<
  typeof ExecutePlan$Result
>; 