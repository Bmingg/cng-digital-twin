import {
  CreateCompressorTypes$Params,
  CreateCompressorTypes$Result 
} from "./typing";

// example: const result = await httpPut$UpdateTruckTypes(`${CLIENT_ENV.BACKEND_URL}/api/resources/truck-types`, params, token)
export async function httpPost$CreateCompressorTypes(
  url: string,
  body_data: CreateCompressorTypes$Params,
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
  const result = CreateCompressorTypes$Result.parse(data);
  return result;
}
