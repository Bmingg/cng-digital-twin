import { UpdateStations$Params, UpdateStations$Result } from "./typing";

// example: const result = await httpPut$UpdateTruckTypes(`${CLIENT_ENV.BACKEND_URL}/api/resources/truck-types`, params, token)
export async function httpPut$UpdateStations(
  url: string,
  { id, ...others }: UpdateStations$Params,
  token: string
) {
  const response = await fetch(`${url}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(others),
  });
  if (!response.ok) {
    throw new Error("response not ok");
  }
  const text = await response.text();
  const data = JSON.parse(text);
  const result = UpdateStations$Result.parse(data);
  return result;
}
