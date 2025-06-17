import { GetDispatchPlans$Params, GetDispatchPlans$Result } from "./typing";

export async function httpGet$GetDispatchPlans(
  url: string,
  { start_date }: GetDispatchPlans$Params,
  token: string
) {
  const end_date = new Date(start_date);
  start_date.setUTCHours(0, 0, 0);
  end_date.setUTCHours(23, 59, 59);

  const response = await fetch(
    `${url}?start_date=${start_date.toISOString()}&end_date=${end_date.toISOString()}`,
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
