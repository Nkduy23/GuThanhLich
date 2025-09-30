import { useState } from "react";

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

function useAuthForm<T>(url: string, onSuccess: (data: T) => void) {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (body: unknown) => {
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data: ApiResponse<T> = await response.json();

      if (response.ok) {
        setMessage(data.message || "Thành công!");
        onSuccess(data as T);
      } else {
        setError(data.message || "Lỗi không xác định");
      }
    } catch {
      setError("Lỗi kết nối server");
    } finally {
      setLoading(false);
    }
  };

  return { error, message, loading, handleSubmit };
}

export default useAuthForm;
