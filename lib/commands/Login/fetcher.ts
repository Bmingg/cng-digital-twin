import { Login$Params, Login$Result } from "./typing";

export async function httpPost(
  url: string,
  params: Login$Params
): Promise<Login$Result> {
  const searchParams = new URLSearchParams(params);
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: searchParams.toString(),
  });
  if (!response.ok) {
    throw new Error("response not ok");
  }
  const text = await response.text();
  const data = JSON.parse(text);
  const result = Login$Result.parse(data);
  return result;
}

export const httpPost$Login = httpPost;
