import { GetPlanAssignments$Result } from "./typing";

export async function httpGet$GetPlanAssignments(url: string, token: string) {
  const response = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  const text = await response.text();
  const data = JSON.parse(text);
  const result = GetPlanAssignments$Result.parse(data);
  return result;
}
