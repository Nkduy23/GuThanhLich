interface FetchOptions extends RequestInit {
  requiresAuth?: boolean; // Nếu endpoint cần cookie/session
}

export const apiRequest = async <T>(endpoint: string, options: FetchOptions = {}): Promise<T> => {
  try {
    const { requiresAuth = false, headers, ...restOptions } = options;

    const response = await fetch(endpoint, {
      method: restOptions.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(headers || {}),
      },
      credentials: requiresAuth ? "include" : "same-origin",
      ...restOptions,
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("❌ API request failed:", error);
    throw error;
  }
};
