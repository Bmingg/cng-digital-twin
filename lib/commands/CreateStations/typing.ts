import { z } from "zod";

export const CreateStations$Params = z.object({
  id: z.string(),
  address: z.string(),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  gps_coordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  }),
});
export type CreateStations$Params = z.infer<typeof CreateStations$Params>;

export const CreateStations$Result = CreateStations$Params;
export type CreateStations$Result = CreateStations$Params;
