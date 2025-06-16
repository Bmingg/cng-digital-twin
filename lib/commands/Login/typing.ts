import { z } from "zod";

export const Login$Params = z.object({
  username: z.string(),
  password: z.string(),
  grant_type: z.string(),
});
export type Login$Params = z.infer<typeof Login$Params>;

export const Login$Result = z.object({
  access_token: z.string(),
  token_type: z.string(),
});
export type Login$Result = z.infer<typeof Login$Result>;
