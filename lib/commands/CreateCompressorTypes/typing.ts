import { z } from "zod";

export const CreateCompressorTypes$Params = z.object({
  id: z.string(),
  capacity: z.number(),
  capacity_m3: z.number(),
  count: z.number(),
});
export type CreateCompressorTypes$Params = z.infer<typeof CreateCompressorTypes$Params>;

export const CreateCompressorTypes$Result = CreateCompressorTypes$Params;
export type CreateCompressorTypes$Result = CreateCompressorTypes$Params;
