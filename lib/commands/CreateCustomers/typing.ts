import { z } from "zod";

export const CreateCustomers$Params = z.object({
  id: z.number(),
  name: z.string(),
  address: z.string(),
  contact_info: z.string(),
  longtitude: z.number().optional(),
  latitude: z.number().optional(),
  gps_coordinates: z.object({
      latitude: z.number(),
      longitude: z.number(),
  }),
});
export type CreateCustomers$Params = z.infer<typeof CreateCustomers$Params>;

export const CreateCustomers$Result = CreateCustomers$Params;
export type CreateCustomers$Result = CreateCustomers$Params;
