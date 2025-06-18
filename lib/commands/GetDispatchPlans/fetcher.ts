import { GetDispatchPlans$Params, GetDispatchPlans$Result } from "./typing";

export async function httpGet$GetDispatchPlans(
  url: string,
  { start_date }: GetDispatchPlans$Params,
  token: string
) {
  // Create start and end of day in UTC
  const startOfDay = new Date(start_date);
  const endOfDay = new Date(start_date);
  
  startOfDay.setUTCHours(0, 0, 0, 0);
  endOfDay.setUTCHours(23, 59, 59, 999);

  const response = await fetch(
    `${url}?start_date=${startOfDay.toISOString()}&end_date=${endOfDay.toISOString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );
  const text = await response.text();
  const data = JSON.parse(text);
  const result = GetDispatchPlans$Result.parse(data);
  return result;
}
