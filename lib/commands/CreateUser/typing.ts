import { z } from "zod";

export const CreateUser$Params = z.object({
  email: z.string().email(),
  password: z.string(),
  is_superuser: z
    .enum(["true", "false"])
    .transform((value) => value === "true"),
});
export type CreateUser$Params = z.infer<typeof CreateUser$Params>;

export const CreateUser$Result = z.object({
  id: z.string(),
  email: z.string().email(),
  is_active: z.enum(["true", "false"]).transform((value) => value === "true"),
  is_superuser: z
    .enum(["true", "false"])
    .transform((value) => value === "true"),
});
export type CreateUser$Result = z.infer<typeof CreateUser$Result>;
