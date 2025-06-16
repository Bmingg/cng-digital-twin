import { z } from "zod";

export const ClientEnv = z.object({
  BACKEND_URL: z.string().url(),
});

export type ClientEnv = z.infer<typeof ClientEnv>;

export const CLIENT_ENV = ClientEnv.parse({
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL,
});
