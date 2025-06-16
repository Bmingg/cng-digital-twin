import {
  GetResourcesCompressorTypes$Params,
  GetResourcesCompressorTypes$Result,
} from "./typing";

export async function httpGet$GetResourcesCompressorTypes(
  url: string,
  { limit, skip }: GetResourcesCompressorTypes$Params,
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
  const result = GetResourcesCompressorTypes$Result.parse(data);
  return result;
}
