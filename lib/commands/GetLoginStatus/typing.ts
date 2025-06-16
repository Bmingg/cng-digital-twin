import { z } from "zod";

export const GetLoginStatus$Params = z.object({
  token: z.string().min(1),
});
export type GetLoginStatus$Params = z.infer<typeof GetLoginStatus$Params>;

export const GetLoginStatus$Result = z.object({
  id: z.string(),
  email: z.string().email(),
  is_active: z.boolean(),
  is_superuser: z.boolean(),
});
export type GetLoginStatus$Result = z.infer<typeof GetLoginStatus$Result>;
