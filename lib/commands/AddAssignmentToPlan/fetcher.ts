import { z } from "zod";
import {
  AddAssignmentToPlan$Params,
  AddAssignmentToPlan$Result,
} from "./typing";

const ErrorMessage = z.object({
  detail: z.string(),
});

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
    const text = await response.text();
    const data = JSON.parse(text);
    const result = ErrorMessage.safeParse(data);
    if (result.success) {
      throw new Error(result.data.detail);
    } else {
      throw new Error("response not ok");
    }
  }
  const text = await response.text();
  const data = JSON.parse(text);
  const result = AddAssignmentToPlan$Result.parse(data);
  return result;
}

export const httpPost$AddAssignmentToPlan = httpPost;
