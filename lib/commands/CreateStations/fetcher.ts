import {
  CreateStations$Params,
  CreateStations$Result 
} from "./typing";

export async function httpPost$CreateStations(
  url: string,
  body_data: CreateStations$Params,
  token: string
) {
  const response = await fetch(`${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body_data),
  });
  if (!response.ok) {
    throw new Error("response not ok");
  }
  const text = await response.text();
  const data = JSON.parse(text);
  const result = CreateStations$Result.parse(data);
  return result;
}
