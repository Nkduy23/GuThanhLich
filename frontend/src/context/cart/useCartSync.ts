import { useEffect } from "react";
import { useCart } from "./useCart";
import { useAuth } from "@/context/auth/useAuth";

export const useCartSync = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { hydrateLocalCartDetails, mergeLocalCart } = useCart();

  useEffect(() => {
    if (authLoading) return; // Chờ auth load xong

    const syncCart = async () => {
      if (isAuthenticated) {
        // User đăng nhập: ưu tiên merge local cart nếu có, rồi fetch server
        await mergeLocalCart(); // Nếu có local → merge lên server → fetch lại
      } else {
        // Guest: chỉ lấy từ localStorage
        await hydrateLocalCartDetails();
      }
    };

    syncCart();
  }, [isAuthenticated, authLoading, mergeLocalCart, hydrateLocalCartDetails]);
};
