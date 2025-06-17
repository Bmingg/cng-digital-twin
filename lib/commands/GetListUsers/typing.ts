import { z } from "zod";

export const GetListUsers$Result = z.object({
  id: z.string(),
  email: z.string().email(),
  is_active: z.enum(["true", "false"]).transform((value) => value === "true"),
  is_superuser: z
    .enum(["true", "false"])
    .transform((value) => value === "true"),
});
export type GetListUsers$Result = z.infer<typeof GetListUsers$Result>;
