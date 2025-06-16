import {
  GetResourcesTrucks$Params,
  GetResourcesTrucks$Result,
} from "./typing";

export async function httpGet$GetResourcesTrucks(
  url: string,
  { limit, skip }: GetResourcesTrucks$Params,
  token: string
) {
  const response = await fetch(`${url}?skip=${skip}&limit=${limit}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const text = await response.text();
  const data = JSON.parse(text);
  const result = GetResourcesTrucks$Result.parse(data);
  return result;
}
