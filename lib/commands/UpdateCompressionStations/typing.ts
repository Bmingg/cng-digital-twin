import { number, z } from "zod";

export const UpdateCompressionStations$Params = z.object({
  id: z.string(),
  address: z.string(),
  gps_coordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().max(180).min(-180),
  }),
  number_of_compressors: z.number().int().min(0),
});
export type UpdateCompressionStations$Params = z.infer<typeof UpdateCompressionStations$Params>;

export const UpdateCompressionStations$Result = UpdateCompressionStations$Params;
export type UpdateCompressionStations$Result = UpdateCompressionStations$Params;
