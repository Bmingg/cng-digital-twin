import { z } from "zod";

export const CreateTrucks$Params = z.object({
  id: z.number(),
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
  }).optional(),
});
export type CreateTrucks$Params = z.infer<typeof CreateTrucks$Params>;

export const CreateTrucks$Result = CreateTrucks$Params;
export type CreateTrucks$Result = CreateTrucks$Params;
