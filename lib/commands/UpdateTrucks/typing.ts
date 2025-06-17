import { z } from "zod";

export const UpdateTrucks$Params = z.object({
  id: z.number(),
  status: z.string(),
  station_id: z.string(),    
});
export type UpdateTrucks$Params = z.infer<typeof UpdateTrucks$Params>;

export const UpdateTrucks$Result = UpdateTrucks$Params;
export type UpdateTrucks$Result = UpdateTrucks$Params;
