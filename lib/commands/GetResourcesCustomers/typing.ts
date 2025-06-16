import { z } from "zod";

export const GetResourcesCustomers$Params = z.object({
  limit: z.number().optional().default(100),
  skip: z.number().optional().default(0),
});
export type GetResourcesCustomers$Params = z.infer<
  typeof GetResourcesCustomers$Params
>;

export const GetResourcesCustomers$Result = z
  .object({
    name: z.string(),
    address: z.string(),
    contact_info: z.string(),
    id: z.number(),
    longtitude: z.number(),
    latitude: z.number(),
    gps_coordinates: z.object({
      latitude: z.number(),
      longitude: z.number(),
    }),
  })
  .array();
export type GetResourcesCustomers$Result = z.infer<
  typeof GetResourcesCustomers$Result
>;
