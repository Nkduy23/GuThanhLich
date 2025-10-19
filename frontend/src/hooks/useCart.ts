import { useState, useEffect, useCallback } from "react";
import type { Cart_Item } from "../types";
import { useAuth } from "../client/context/auth/AuthContext";

export const useCart = () => {
  const [cartItems, setCartItems] = useState<Cart_Item[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  const API_BASE = "http://localhost:3000/api/cart";

  const calculateTotal = (items: Cart_Item[]) => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  // Load cart
  const fetchCart = useCallback(async () => {
    setLoading(true);
    if (!isAuthenticated) {
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItems(localCart);
      setTotal(calculateTotal(localCart));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(API_BASE, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setCartItems(data.cart);
        setTotal(data.totalPrice);
      }
    } catch (error) {
      console.error("Fetch cart error:", error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Add item từ detail
  const addToCart = async (item: Omit<Cart_Item, "_id">) => {
    if (!isAuthenticated) {
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const existingIndex = localCart.findIndex(
        (i: Cart_Item) => i.variantId === item.variantId && i.size === item.size
      );

      if (existingIndex > -1) {
        localCart[existingIndex].quantity += item.quantity;
      } else {
        localCart.push(item);
      }

      localStorage.setItem("cart", JSON.stringify(localCart));
      setCartItems(localCart);
      setTotal(calculateTotal(localCart));
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.productId,
          variantId: item.variantId,
          size: item.size,
          quantity: item.quantity,
          unit_price: item.price,
        }),
        credentials: "include",
      });

      if (res.ok) {
        await fetchCart(); // Refresh
      } else {
        const { message } = await res.json();
        alert(message);
      }
    } catch (error) {
      console.error("Add to cart error:", error);
    }
  };

  // Update quantity
  const updateQuantity = async (id: string, quantity: number) => {
    if (!isAuthenticated) {
      // Local mode
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const updatedCart = localCart.map((item: Cart_Item) =>
        item.id === id ? { ...item, quantity } : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      setTotal(calculateTotal(updatedCart));
      return;
    }

    // Server mode
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
        credentials: "include",
      });

      if (res.ok) {
        await fetchCart();
      } else {
        const { message } = await res.json();
        alert(message);
      }
    } catch (error) {
      console.error("Update cart error:", error);
    }
  };

  const updateVariant = async (
    itemId: string,
    newVariantId: string,
    newSize: string,
    newQuantity?: number
  ) => {
    if (!isAuthenticated) {
      // Local mode
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const updatedCart = localCart.map((item: Cart_Item) =>
        item.id === itemId ? { ...item, variantId: newVariantId, size: newSize } : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      setTotal(calculateTotal(updatedCart));
      return;
    }

    // Server mode
    try {
      const res = await fetch(`${API_BASE}/${itemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variantId: newVariantId, size: newSize, quantity: newQuantity }),
        credentials: "include",
      });

      if (res.ok) {
        await fetchCart();
      } else {
        const { message } = await res.json();
        alert(message);
      }
    } catch (error) {
      console.error("Update cart error:", error);
    }
  };

  // Remove item
  const removeItem = async (id: string) => {
    if (!isAuthenticated) {
      // ✅ Local mode
      const localCart = JSON.parse(localStorage.getItem("cart") || "[]");
      const updatedCart = localCart.filter((item: Cart_Item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      setCartItems(updatedCart);
      setTotal(calculateTotal(updatedCart));
      return;
    }

    // ✅ Server mode
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        await fetchCart();
      } else {
        const { message } = await res.json();
        alert(message);
      }
    } catch (error) {
      console.error("Remove cart error:", error);
    }
  };

  // Merge Cart
  // Check lại hiện tại chưa merger được do map color đang sai ở client chưa đăng nhập
  const mergeLocalCart = async () => {
    const localCart = JSON.parse(localStorage.getItem("cart") || "[]");

    if (!localCart.length) return;

    const payload = localCart.map(
      (i: { productId: unknown; variantId: unknown; size: unknown; quantity: unknown }) => ({
        productId: i.productId,
        variantId: i.variantId,
        size: i.size,
        quantity: i.quantity,
      })
    );

    const res = await fetch("http://localhost:3000/api/cart/merge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: payload }),
      credentials: "include",
    });

    if (res.ok) {
      localStorage.removeItem("cart");
    } else {
      console.error("Merge failed");
    }
  };

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cartItems,
    total,
    loading,
    fetchCart,
    addToCart,
    updateQuantity,
    updateVariant,
    removeItem,
    mergeLocalCart,
  };
};
