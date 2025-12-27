// src/components/layout/HeaderActions.tsx
import { Link } from "react-router-dom";
import { User, ShoppingBag } from "lucide-react";
import { useAuth } from "@/context/auth/useAuth";
import { useCart } from "@/context/cart/useCart";

const HeaderActions = () => {
  const { role } = useAuth();
  const { cartCount } = useCart();

  return (
    <div className="flex items-center gap-2 lg:gap-4">
      <Link
        to={role ? "/profile" : "/login"}
        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label={role ? "Profile" : "Login"}
      >
        <User className="w-6 h-6 stroke-[1.5]" />
      </Link>

      <Link
        to="/cart"
        className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Giỏ hàng"
      >
        <ShoppingBag className="w-6 h-6 stroke-[1.5]" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold min-w-[20px] h-5 flex items-center justify-center rounded-full px-1.5">
            {cartCount > 99 ? "99+" : cartCount}
          </span>
        )}
      </Link>
    </div>
  );
};

export default HeaderActions;
