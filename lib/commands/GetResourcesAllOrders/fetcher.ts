import {
  GetResourcesAllOrders$Params,
  GetResourcesAllOrders$Result,
} from "./typing";

export async function httpGet$GetResourcesAllOrders(
  url: string,
  token: string,
) {
  const response = await fetch(`${url}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const text = await response.text();
  const data = JSON.parse(text);
  const result = GetResourcesAllOrders$Result.parse(data);
  return result;
}
