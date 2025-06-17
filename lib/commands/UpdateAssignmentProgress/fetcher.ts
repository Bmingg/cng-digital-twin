import {
  UpdateAssignmentProgress$Params,
  UpdateAssignmentProgress$Result,
} from "./typing";

export async function httpPatch$UpdateAssignmentProgress(
  url: string,
  params: UpdateAssignmentProgress$Params,
  token: string
) {
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
    throw new Error("response not ok");
  }
  const text = await response.text();
  const data = JSON.parse(text);
  const result = UpdateAssignmentProgress$Result.parse(data);
  return result;
}
