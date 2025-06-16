import {
  GetResourcesOrders$Params,
  GetResourcesOrders$Result,
} from "./typing";

export async function httpGet$GetResourcesOrders(
  url: string,
  { date, status, customer_id }: GetResourcesOrders$Params,
  token: string
) {
  const response = await fetch(`${url}?date=${date}&status=${status}&customer_id=${customer_id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const text = await response.text();
  const data = JSON.parse(text);
  const result = GetResourcesOrders$Result.parse(data);
  return result;
}
