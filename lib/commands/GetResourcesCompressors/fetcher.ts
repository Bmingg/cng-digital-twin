import {
  GetResourcesCompressors$Params,
  GetResourcesCompressors$Result,
} from "./typing";

export async function httpGet$GGetResourcesCompressors(
  url: string,
  { limit, skip }: GetResourcesCompressors$Params,
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
  const result = GetResourcesCompressors$Result.parse(data);
  return result;
}
