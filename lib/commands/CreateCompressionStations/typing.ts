import { z } from "zod";

export const CreateCompressionStations$Params = z.object({
  id: z.string(),
  address: z.string(),
  number_of_compressors: z.number(),
  latitude: z.number(),
  longitude: z.number(),
  gps_coordinates: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
});
export type CreateCompressionStations$Params = z.infer<typeof CreateCompressionStations$Params>;

export const CreateCompressionStations$Result = CreateCompressionStations$Params;
export type CreateCompressionStations$Result = CreateCompressionStations$Params;
