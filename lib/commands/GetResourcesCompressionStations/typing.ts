import { z } from "zod";

export const GetResourcesCompressionStations$Params = z.object({
  limit: z.number().optional().default(100),
  skip: z.number().optional().default(0),
});
export type GetResourcesCompressionStations$Params = z.infer<
  typeof GetResourcesCompressionStations$Params
>;

export const GetResourcesCompressionStations$Result = z
  .object({
    id: z.string(),
    address: z.string(),
    number_of_compressors: z.number(),
    latitude: z.number(),
    longitude: z.number(),
    gps_coordinates: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }),
  })
  .array();
export type GetResourcesCompressionStations$Result = z.infer<
  typeof GetResourcesCompressionStations$Result
>;
