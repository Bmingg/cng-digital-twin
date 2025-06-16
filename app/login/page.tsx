import { cookies } from "next/headers";
import { CLIENT_ENV } from "@/lib/env";
import { redirect } from "next/navigation";
import { httpGet$GetLoginStatus } from "@/lib/commands/GetLoginStatus/fetcher";
import PageLogin from "./_containers/PageLogin";

export default async function Route() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (token) {
    const user = await httpGet$GetLoginStatus(
      `${CLIENT_ENV.BACKEND_URL}/api/users/me`,
      {
        token,
      }
    ).catch((error) => {
      console.error(error);
      return undefined;
    });
    if (user) {
      redirect("/dashboard");
    }
  }
  return <PageLogin />;
}