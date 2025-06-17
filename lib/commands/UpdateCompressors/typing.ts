import { z } from "zod";

export const UpdateCompressors$Params = z.object({
  id: z.string(),
  status: z.string(),
  compressor_station_id: z.string(),
});
export type UpdateCompressors$Params = z.infer<typeof UpdateCompressors$Params>;

export const UpdateCompressors$Result = UpdateCompressors$Params;
export type UpdateCompressors$Result = UpdateCompressors$Params;
