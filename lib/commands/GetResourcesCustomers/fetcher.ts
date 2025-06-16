import {
  GetResourcesCustomers$Params,
  GetResourcesCustomers$Result,
} from "./typing";

export async function httpGet$GetResourcesCustomers(
  url: string,
  { limit, skip }: GetResourcesCustomers$Params,
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
  const result = GetResourcesCustomers$Result.parse(data);
  return result;
}
