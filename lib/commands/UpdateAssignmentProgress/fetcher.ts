import { z } from "zod";
import {
  UpdateAssignmentProgress$Params,
  UpdateAssignmentProgress$Result,
} from "./typing";

const ErrorMessage = z.object({
  detail: z.string(),
});

export async function httpPatch(
  url: string,
  params: UpdateAssignmentProgress$Params,
  token: string
): Promise<UpdateAssignmentProgress$Result> {
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(params),
  });
  
  if (!response.ok) {
    const text = await response.text();
    console.error('UpdateAssignmentProgress API Error:', {
      status: response.status,
      statusText: response.statusText,
      url: url,
      params: params,
      responseText: text
    });
    
    try {
      const data = JSON.parse(text);
      const result = ErrorMessage.safeParse(data);
      if (result.success) {
        throw new Error(result.data.detail);
      } else {
        // Try to extract error message from other possible formats
        if (data.message) {
          throw new Error(data.message);
        } else if (data.error) {
          throw new Error(data.error);
        } else {
          throw new Error(`API Error: ${response.status} ${response.statusText}. Response: ${text}`);
        }
      }
    } catch (parseError) {
      throw new Error(`API Error: ${response.status} ${response.statusText}. Response: ${text}`);
    }
  }
  
  const text = await response.text();
  const data = JSON.parse(text);
  const result = UpdateAssignmentProgress$Result.parse(data);
  return result;
}

export const httpPatch$UpdateAssignmentProgress = httpPatch;
