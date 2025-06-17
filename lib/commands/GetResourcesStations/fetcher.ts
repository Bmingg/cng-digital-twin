import {
  GetResourcesStations$Params,
  GetResourcesStations$Result,
} from "./typing";

export async function httpGet$GetResourcesStations(
  url: string,
  { limit, skip }: GetResourcesStations$Params,
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
  const result = GetResourcesStations$Result.parse(data);
  return result;
}
