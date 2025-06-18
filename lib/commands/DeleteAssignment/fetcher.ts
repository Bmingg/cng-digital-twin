import { CLIENT_ENV } from "@/lib/env";

export async function httpDelete$DeleteAssignment(
  url: string,
  token: string
): Promise<void> {
  try {
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        "accept": "*/*",
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    // DELETE typically returns no content
    return;
  } catch (error) {
    console.error("Delete assignment error:", error);
    throw error;
  }
} 