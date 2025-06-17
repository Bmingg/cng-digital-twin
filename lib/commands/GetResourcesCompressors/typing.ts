import { count } from "console";
import { comma } from "postcss/lib/list";
import { z } from "zod";

export const GetResourcesCompressors$Params = z.object({
  limit: z.number().optional().default(100),
  skip: z.number().optional().default(0),
});
export type GetResourcesCompressors$Params = z.infer<
  typeof GetResourcesCompressors$Params
>;

export const GetResourcesCompressors$Result = z
  .object({
    id: z.number(),
    compressor_type_id: z.string(),
    compressor_station_id: z.string(),
    status: z.string(),
    compressor_type: z.object({
      id: z.string(),
      capacity: z.number(),
      capacity_m3: z.number(),
      count: z.number(),
    }),
    compressor_station: z.object({
      id: z.string(),
      address: z.string(),
      number_of_compressors: z.number(),
      latitude: z.number(),
      longitude: z.number(),
      gps_coordinates: z.object({
        latitude: z.number(),
        longitude: z.number(),
      }).optional(),
    }).optional(),
  })
  .array();
export type GetResourcesCompressors$Result = z.infer<
  typeof GetResourcesCompressors$Result
>;
