import { z } from "zod";

export const ClientEnv = z.object({
  BACKEND_URL: z.string().url(),
  MAPBOX_ACCESS_TOKEN: z.string(),
});

export type ClientEnv = z.infer<typeof ClientEnv>;

export const CLIENT_ENV = ClientEnv.parse({
  BACKEND_URL: process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000",
  MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || "pk.dummy_token_for_development",
});
