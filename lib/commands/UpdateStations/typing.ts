import { z } from "zod";

export const UpdateStations$Params = z.object({
  id: z.string(),
  address: z.string(),
  gps_coordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().max(180).min(-180),
  }),
});
export type UpdateStations$Params = z.infer<typeof UpdateStations$Params>;

export const UpdateStations$Result = UpdateStations$Params;
export type UpdateStations$Result = UpdateStations$Params;
