import { z } from "zod";

export const CreateGasTanks$Params = z.object({
  id: z.number(),
  gas_tank_type_id: z.string(),
  status: z.string(),
  station_id: z.string(),
});
export type CreateGasTanks$Params = z.infer<typeof CreateGasTanks$Params>;

export const CreateGasTanks$Result = CreateGasTanks$Params;
export type CreateGasTanks$Result = CreateGasTanks$Params;
