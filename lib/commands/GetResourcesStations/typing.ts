import { z } from "zod";

export const GetResourcesStations$Params = z.object({
  limit: z.number().optional().default(100),
  skip: z.number().optional().default(0),
});
export type GetResourcesStations$Params = z.infer<
  typeof GetResourcesStations$Params
>;

export const GetResourcesStations$Result = z
  .object({
    id: z.string(),
    address: z.string(),
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
    gps_coordinates: z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    }),
  })
  .array();
export type GetResourcesStations$Result = z.infer<
  typeof GetResourcesStations$Result
>;
