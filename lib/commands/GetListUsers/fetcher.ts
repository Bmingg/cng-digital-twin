import { GetListUsers$Result } from "./typing";

export async function httpGet$GetListUsers(
  url: string
): Promise<GetListUsers$Result> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("response not ok");
  }
  const text = await response.text();
  const data = JSON.parse(text);
  const result = GetListUsers$Result.parse(data);
  return result;
}
