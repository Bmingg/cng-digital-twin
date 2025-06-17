import { cookies } from "next/headers";
import PageAdmin from "./_containers/PageAdmin";
import { httpGet$GetLoginStatus } from "@/lib/commands/GetLoginStatus/fetcher";
import { CLIENT_ENV } from "@/lib/env";
import { notFound, redirect } from "next/navigation";

export default async function Dashboard() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) {
    redirect("/login");
  }
  const user = await httpGet$GetLoginStatus(
    `${CLIENT_ENV.BACKEND_URL}/api/users/me`,
    {
      token,
    }
  ).catch((error) => {
    return undefined;
  });
  if (!user) {
    redirect("/login");
  }
  if (!user.is_superuser) {
    notFound();
  }
  return <PageAdmin token={token} currentUser={user} />;
}
