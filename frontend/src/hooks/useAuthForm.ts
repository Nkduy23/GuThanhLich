import { useState } from "react";
import { showToast, showNetworkError } from "../utils/toastHandler";

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

function useAuthForm<T>(url: string, onSuccess?: (data: T) => void) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (body: unknown) => {
    setLoading(true);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });

      const data: ApiResponse<T> = await response.json();

      showToast(response, data);

      if (response.ok && data.success) {
        onSuccess?.(data.data as T);
      }
    } catch {
      showNetworkError();
    } finally {
      setLoading(false);
    }
  };

  return { loading, handleSubmit };
}

export default useAuthForm;
