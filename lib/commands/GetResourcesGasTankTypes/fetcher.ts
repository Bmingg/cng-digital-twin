import {
  GetResourcesGasTankTypes$Params,
  GetResourcesGasTankTypes$Result,
} from "./typing";

export async function httpGet$GetResourcesGasTankTypes(
  url: string,
  { limit, skip }: GetResourcesGasTankTypes$Params,
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
  const result = GetResourcesGasTankTypes$Result.parse(data);
  return result;
}
