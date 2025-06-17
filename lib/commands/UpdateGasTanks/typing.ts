import { stat } from "fs";
import { z } from "zod";

export const UpdateGasTanks$Params = z.object({
  id: z.string(),
  status: z.string(),
  station_id: z.string(),
});
export type UpdateGasTanks$Params = z.infer<typeof UpdateGasTanks$Params>;

export const UpdateGasTanks$Result = UpdateGasTanks$Params;
export type UpdateGasTanks$Result = UpdateGasTanks$Params;
