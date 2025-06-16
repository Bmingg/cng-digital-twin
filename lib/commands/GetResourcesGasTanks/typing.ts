import { LocalDining } from "@mui/icons-material";
import { LogIn } from "lucide-react";
import { late, z } from "zod";

export const GetResourcesGasTanks$Params = z.object({
  limit: z.number().optional().default(100),
  skip: z.number().optional().default(0),
});
export type GetResourcesGasTanks$Params = z.infer<
  typeof GetResourcesGasTanks$Params
>;

export const GetResourcesGasTanks$Result = z
  .object({
    id: z.string(),
    gas_tank_type_id: z.string(),
    status: z.string(),
    station_id: z.string(),
    gas_tank_type: z.object({
      id: z.string(),
      count: z.number(),
      vmax: z.number(),
      owned: z.string(),
      rental_cost_by_hour: z.number(),
      loading_time: z.number(),
    }),
    station: z.object({
      id: z.string(),
      address: z.string(),
      latitude: z.number(),
      longtitude: z.number(),
      gps_coordinates: z.object({
        latitude: z.number(),
        longtitude: z.number(),
      }),
    }),
  })
  .array();
export type GetResourcesGasTanks$Result = z.infer<
  typeof GetResourcesGasTanks$Result
>;
