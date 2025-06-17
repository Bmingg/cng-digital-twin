import { z } from "zod";

export const CreateCompressors$Params = z.object({
  id: z.number(),
  compressor_type_id: z.string(),
  compressor_station_id: z.string(),
  status: z.string(),
});
export type CreateCompressors$Params = z.infer<typeof CreateCompressors$Params>;

export const CreateCompressors$Result = CreateCompressors$Params;
export type CreateCompressors$Result = CreateCompressors$Params;
