import {
  GetResourcesGasTanks$Params,
  GetResourcesGasTanks$Result,
} from "./typing";

export async function httpGet$GetResourcesGasTanks(
  url: string,
  { limit, skip }: GetResourcesGasTanks$Params,
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
  const result = GetResourcesGasTanks$Result.parse(data);
  return result;
}
