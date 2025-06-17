import { DeleteResources$Params } from "./typing";

export async function httpDelete$DeleteResources(
  url: string,
  { id }: DeleteResources$Params,
  token: string,
) {
  const response = await fetch(`${url}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("response not ok");
  }
}
