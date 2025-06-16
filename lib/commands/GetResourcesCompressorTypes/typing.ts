import { z } from "zod";

export const GetResourcesCompressorTypes$Params = z.object({
  limit: z.number().optional().default(100),
  skip: z.number().optional().default(0),
});
export type GetResourcesCompressorTypes$Params = z.infer<
  typeof GetResourcesCompressorTypes$Params
>;

export const GetResourcesCompressorTypes$Result = z
  .object({
    id: z.string(),
    capacity: z.number(),
    capacity_m3: z.number(),
    count: z.number(),
  })
  .array();
export type GetResourcesCompressorTypes$Result = z.infer<
  typeof GetResourcesCompressorTypes$Result
>;
