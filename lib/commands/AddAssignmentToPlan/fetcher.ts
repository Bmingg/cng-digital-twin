import {
  AddAssignmentToPlan$Params,
  AddAssignmentToPlan$Result,
} from "./typing";

export async function httpPost(
  url: string,
  params: AddAssignmentToPlan$Params
): Promise<AddAssignmentToPlan$Result> {
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
  const result = AddAssignmentToPlan$Result.parse(data);
  return result;
}

export const httpPost$AddAssignmentToPlan = httpPost;
