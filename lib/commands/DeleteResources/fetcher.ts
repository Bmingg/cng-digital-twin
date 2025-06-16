import { DeleteResources$Params } from "./typing";

export async function httpDelete$DeleteResources(
  url: string,
  { id }: DeleteResources$Params
) {
  const response = await fetch(`${url}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  if (!response.ok) {
    throw new Error("response not ok");
  }
}
