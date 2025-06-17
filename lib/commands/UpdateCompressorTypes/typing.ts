import { count } from "console";
import { z } from "zod";

export const UpdateCompressorTypes$Params = z.object({
  id: z.string(),
  capacity: z.number(),
  capacity_m3: z.number(),
  count: z.number(),
});
export type UpdateCompressorTypes$Params = z.infer<typeof UpdateCompressorTypes$Params>;

export const UpdateCompressorTypes$Result = UpdateCompressorTypes$Params;
export type UpdateCompressorTypes$Result = UpdateCompressorTypes$Params;
