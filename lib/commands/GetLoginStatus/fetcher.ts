import { GetLoginStatus$Params, GetLoginStatus$Result } from "./typing";

export async function httpGet$GetLoginStatus(
  url: string,
  { token }: GetLoginStatus$Params
) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const text = await response.text();
  const data = JSON.parse(text);
  const result = GetLoginStatus$Result.parse(data);
  return result;
}
