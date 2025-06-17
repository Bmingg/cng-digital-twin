import { CreateUser$Params, CreateUser$Result } from "./typing";

export async function httpPost$CreateUser(
  url: string,
  params: CreateUser$Params
): Promise<CreateUser$Result> {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(params),
  });
  if (!response.ok) {
    throw new Error("response not ok");
  }
  const text = await response.text();
  const data = JSON.parse(text);
  const result = CreateUser$Result.parse(data);
  return result;
}
