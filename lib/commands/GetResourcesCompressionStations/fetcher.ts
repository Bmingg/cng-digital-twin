import {
  GetResourcesCompressionStations$Params,
  GetResourcesCompressionStations$Result,
} from "./typing";

export async function httpGet$GetResourcesCompressionStations(
  url: string,
  { limit, skip }: GetResourcesCompressionStations$Params,
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
  const result = GetResourcesCompressionStations$Result.parse(data);
  return result;
}
