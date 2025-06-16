import { z } from "zod";

export const GetResourcesTrucks$Params = z.object({
  limit: z.number().optional().default(100),
  skip: z.number().optional().default(0),
});
export type GetResourcesTrucks$Params = z.infer<
  typeof GetResourcesTrucks$Params
>;

export const GetResourcesTrucks$Result = z
  .object({
    id: z.string(),
    truck_type_id: z.string(),
    status: z.string(),
    station_id: z.string(),
    truck_type: z.object({
      id: z.string(),
      count: z.number(),
      vmax: z.number(),
      owned: z.string(),
      rental_cost_by_hour: z.number(),
    }),
    station: z.object({
      id: z.string(),
      address: z.string(),
      latitude: z.number(),
      longitude: z.number(),
      gps_coordinates: z.object({
        latitude: z.number(),
        longitude: z.number(),
      }),
    }),
  })
  .array();
export type GetResourcesTrucks$Result = z.infer<
  typeof GetResourcesTrucks$Result
>;
