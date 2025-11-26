import type { ApiObjectsResponse } from "../types";

const BASE_URL = "http://localhost:4000";

export async function fetchObjects(
  apiKey: string
): Promise<ApiObjectsResponse> {
  const res = await fetch(`${BASE_URL}/objects`, {
    headers: {
      "x-api-key": apiKey,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Server error ${res.status}: ${text}`);
  }

  return res.json();
}

export async function validateApiKey(apiKey: string): Promise<boolean> {
  try {
    await fetchObjects(apiKey);
    return true;
  } catch {
    return false;
  }
}
