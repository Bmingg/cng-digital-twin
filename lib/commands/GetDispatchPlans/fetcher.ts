import {
  GetDispatchPlans$Params,
  GetDispatchPlans$Result,
} from "./typing";

export async function httpGet$GetDispatchPlans(
  url: string,
  { start_date }: GetDispatchPlans$Params,
  token: string
) {
  const encodedStartDate = encodeURIComponent(start_date);
  const response = await fetch(`${url}?start_date=${encodedStartDate}`, {
  // const response = await fetch(`${url}`, {

    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const text = await response.text();
  const data = JSON.parse(text);
  const result = GetDispatchPlans$Result.parse(data);
  return result;
}
