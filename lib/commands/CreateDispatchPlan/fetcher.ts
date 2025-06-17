import { CreateDispatchPlan$Params, CreateDispatchPlan$Result } from "./typing";

export async function httpPost(
  url: string,
  params: CreateDispatchPlan$Params
): Promise<CreateDispatchPlan$Result> {
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
  const result = CreateDispatchPlan$Result.parse(data);
  return result;
}

export const httpPost$CreateDispatchPlan = httpPost;
