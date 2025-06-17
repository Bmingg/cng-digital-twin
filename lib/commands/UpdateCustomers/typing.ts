import { z } from "zod";

export const UpdateCustomers$Params = z.object({
  id: z.string(),
  name: z.string(),
  address: z.string(),
  contact_info: z.string(),
  gps_coordinates: z.object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().max(180).min(-180),
  }),
});
export type UpdateCustomers$Params = z.infer<typeof UpdateCustomers$Params>;

export const UpdateCustomers$Result = UpdateCustomers$Params;
export type UpdateCustomers$Result = UpdateCustomers$Params;
