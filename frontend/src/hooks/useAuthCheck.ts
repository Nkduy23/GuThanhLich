/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface User {
  id: string;
  role: string;
}

export const useAuthCheck = () => {
  const [auth, setAuth] = useState<null | false | User>(null);

  useEffect(() => {
    const fetchAuth = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/auth/me", {
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message || "Có lỗi xảy ra"); // hiển thị lỗi BE gửi
          setAuth(false); // ❌ chưa đăng nhập
          return;
        }

        setAuth(data.user); // ✅ đăng nhập rồi
      } catch (error) {
        toast.error("Không thể kết nối server");
        setAuth(false);
      }
    };

    fetchAuth(); // ✅ gọi hàm khi component mount
  }, []);

  return auth; // null = loading, false = chưa đăng nhập, object = đã đăng nhập
};
