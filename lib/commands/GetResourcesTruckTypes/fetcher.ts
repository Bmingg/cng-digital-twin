import {
  GetResourcesTruckTypes$Params,
  GetResourcesTruckTypes$Result,
} from "./typing";

export async function httpGet$GetResourcesTruckTypes(
  url: string,
  { limit, skip }: GetResourcesTruckTypes$Params,
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
  const result = GetResourcesTruckTypes$Result.parse(data);
  return result;
}
