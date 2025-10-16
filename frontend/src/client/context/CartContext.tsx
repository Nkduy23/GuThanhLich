// src/client/context/CartContext.tsx
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { apiRequest } from "../../api/fetcher";
import { ENDPOINTS } from "../../api/endpoints";
import { useAuth } from "./AuthContext";
import type { Cart_Item, LocalSummary, Product, ProductIds, Variant } from "../../types";

interface CartContextType {
  cartItems: Cart_Item[];
  localSummary: LocalSummary[];
  total: number;
  loading: boolean;
  fetchServerCart: () => Promise<void>;
  loadLocalSummary: () => void;
  hydrateLocalCartDetails: () => Promise<void>;
  addToCart: (item: Cart_Item) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  updateVariant: (id: string, variantId: string, size: string, quantity?: number) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  mergeLocalCart: () => Promise<void>;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<Cart_Item[]>([]);
  const [localSummary, setLocalSummary] = useState<LocalSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const calculateTotal = (items: Cart_Item[]) =>
    items.reduce((acc, i) => acc + (i.total_price ?? i.unit_price * i.quantity), 0);

  const loadLocalSummary = useCallback(() => {
    const local = JSON.parse(localStorage.getItem("cart") || "[]");
    setLocalSummary(local);

    const totalItems = local.reduce((sum: number, it: Cart_Item) => sum + (it.quantity || 0), 0);
    setCartCount(totalItems);

    const provisionalTotal = local.reduce(
      (s: number, it: Cart_Item) => s + (it.unit_price || 0) * (it.quantity || 0),
      0
    );
    setTotal(provisionalTotal);
  }, []);

  // Fetch server cart (for authenticated users)
  const fetchServerCart = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);

    try {
      const res = await apiRequest<{
        data: { cart: Cart_Item[] };
        totalItems: number;
        totalPrice: number;
        success: boolean;
      }>(ENDPOINTS.cart);

      if (res.success) {
        setCartItems(res.data.cart || []);
        setTotal(res.totalPrice || 0);
        const totalItems =
          res.totalItems ||
          (res.data.cart || []).reduce((sum: number, it: Cart_Item) => sum + (it.quantity || 0), 0);
        setCartCount(totalItems);
      } else {
        setCartItems([]);
        setTotal(0);
        setCartCount(0);
      }
    } catch (err) {
      console.error("fetchServerCart error", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const hydrateLocalCartDetails = useCallback(async () => {
    setLoading(true);
    try {
      const local = JSON.parse(localStorage.getItem("cart") || "[]");

      if (!local.length) {
        setCartItems([]);
        setCartCount(0);
        setTotal(0);
        setLoading(false);
        return;
      }

      // collect unique productIds for batch fetching
      const productIds: string[] = Array.from(new Set(local.map((i: LocalSummary) => i.productId)));

      const productsMap: Record<string, ProductIds> = {};

      // Prefer batch API if you add it server-side
      try {
        const resBatch = await apiRequest<{ products: Product[]; success: boolean }>(
          ENDPOINTS.batchProductId,
          {
            method: "POST",
            body: JSON.stringify({ productIds }),
          }
        );

        if (resBatch.success && Array.isArray(resBatch.products)) {
          resBatch.products.forEach((p: Product) => (productsMap[p._id] = p));
        } else {
          throw new Error("batch failed");
        }
      } catch {
        // fallback: fetch each product individually with populate
        await Promise.all(
          productIds.map(async (pid: string) => {
            try {
              // For fallback, use single product endpoint - assume it also populates productVariants
              // If your single /api/products/:id doesn't populate, update it similarly
              const res = await fetch(`${ENDPOINTS.product}/${pid}`);
              const data = await res.json();
              if (res.ok && data.success && data.product) {
                productsMap[pid] = data.product;
              }
            } catch (error) {
              console.error(`Error fetching product ${pid}`, error);
            }
          })
        );
      }

      // build detailed cart items - now with populated variants
      const detailed = local
        .map((it: LocalSummary) => {
          const prod = productsMap[it.productId];
          if (!prod) return null;
          // find variant from populated productVariants
          const variant =
            (prod.productVariants || []).find((v: any) => v._id.toString() === it.variantId) ||
            ({} as Variant);

          // filter availableSizes >0 stock
          const availableSizes =
            variant.sizes?.filter((s: any) => s.quantity > 0).map((s: any) => s.size) || [];

          return {
            _id: `${it.productId}-${it.variantId}-${it.size}`, // composite for local unique key
            productId: it.productId,
            variantId: it.variantId,
            name: prod.name,
            image: variant.images?.[0] || prod.images?.[0] || "", // fallback to prod images[0]
            color: variant.color || "", // from populated variant
            size: it.size,
            quantity: it.quantity,
            unit_price: it.unit_price, // use saved from local (lock at add time)
            total_price: it.unit_price * it.quantity,
            availableColors: (prod.productVariants || []).map((v: any) => ({
              color: v.color,
              variantId: v._id.toString(),
            })),
            availableSizes,
            price: 0, // add price property
            id: undefined, // add id property
          } as Cart_Item;
        })
        .filter(Boolean);

      setCartItems(detailed);
      const totalItems = detailed.reduce(
        (sum: number, it: Cart_Item) => sum + (it.quantity || 0),
        0
      );
      setCartCount(totalItems);

      setTotal(calculateTotal(detailed));
    } catch (err) {
      console.error("hydrateLocalCartDetails error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(
    async (item: Cart_Item) => {
      setLoading(true);

      try {
        if (!isAuthenticated) {
          const local = JSON.parse(localStorage.getItem("cart") || "[]");
          const idx = local.findIndex(
            (i: any) => i.variantId === item.variantId && i.size === item.size
          );
          if (idx > -1) {
            local[idx].quantity += item.quantity;
          } else {
            local.push(item);
          }
          localStorage.setItem("cart", JSON.stringify(local));

          loadLocalSummary();
          return;
        }

        const res = await apiRequest<{ success: boolean; message: string }>(ENDPOINTS.cartAdd, {
          method: "POST",
          body: JSON.stringify(item),
        });

        if (res.success) {
          await fetchServerCart();
        } else {
          throw new Error(res.message);
        }
      } catch (err) {
        console.error("addToCart error", err);
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, fetchServerCart, loadLocalSummary]
  );

  const updateQuantity = useCallback(
    async (id: string, quantity: number) => {
      if (quantity === 0) {
        return removeItem(id);
      }
      setLoading(true);
      try {
        if (!isAuthenticated) {
          const local = JSON.parse(localStorage.getItem("cart") || "[]");
          const index = cartItems.findIndex((i) => i._id === id);
          if (index === -1) return;
          const current = cartItems[index];
          const lIndex = local.findIndex(
            (l: any) =>
              l.productId === current.productId &&
              l.variantId === current.variantId &&
              l.size === current.size
          );
          if (lIndex > -1) {
            local[lIndex].quantity = quantity;
            localStorage.setItem("cart", JSON.stringify(local));
          }
          await hydrateLocalCartDetails(); // refresh details
          return;
        }

        const res = await apiRequest<{ success: boolean; message: string }>(
          `${ENDPOINTS.cart}/${id}`,
          {
            method: "PUT",
            body: JSON.stringify({ quantity }),
          }
        );

        if (res.success) {
          await fetchServerCart();
        } else {
          throw new Error(res.message);
        }
      } catch (err) {
        console.error("updateQuantity error", err);
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, cartItems, hydrateLocalCartDetails, fetchServerCart]
  );

  const updateVariant = useCallback(
    async (id: string, variantId: string, size: string, quantity?: number) => {
      setLoading(true);
      try {
        if (!isAuthenticated) {
          const local = JSON.parse(localStorage.getItem("cart") || "[]");
          const index = cartItems.findIndex((i) => i._id === id);
          if (index === -1) return;
          const current = cartItems[index];
          const lIndex = local.findIndex(
            (l: any) =>
              l.productId === current.productId &&
              l.variantId === current.variantId &&
              l.size === current.size
          );
          if (lIndex > -1) {
            local[lIndex].variantId = variantId;
            local[lIndex].size = size;
            if (quantity !== undefined) local[lIndex].quantity = quantity;
            // keep unit_price (same product)
            localStorage.setItem("cart", JSON.stringify(local));
          }
          await hydrateLocalCartDetails(); // refresh variant details (image, color, sizes)
          return;
        }
        // server
        const body: any = { variantId, size };
        if (quantity !== undefined) body.quantity = quantity;

        const res = await apiRequest<{ success: boolean; message: string }>(
          `${ENDPOINTS.cart}/${id}`,
          {
            method: "PUT",
            body: JSON.stringify(body),
          }
        );

        if (res.success) {
          await fetchServerCart();
        } else {
          throw new Error(res.message);
        }
      } catch (err) {
        console.error("updateVariant error", err);
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, cartItems, hydrateLocalCartDetails, fetchServerCart]
  );

  const removeItem = useCallback(
    async (id: string) => {
      setLoading(true);
      try {
        if (!isAuthenticated) {
          const local = JSON.parse(localStorage.getItem("cart") || "[]");
          const index = cartItems.findIndex((i) => i._id === id);
          if (index === -1) return;
          const current = cartItems[index];
          const lIndex = local.findIndex(
            (l: any) =>
              l.productId === current.productId &&
              l.variantId === current.variantId &&
              l.size === current.size
          );
          if (lIndex > -1) {
            local.splice(lIndex, 1);
            localStorage.setItem("cart", JSON.stringify(local));
          }
          await hydrateLocalCartDetails(); // refresh
          return;
        }

        const res = await fetch(`${ENDPOINTS.cart}/${id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (res.ok) {
          await fetchServerCart();
        } else {
          const d = await res.json();
          alert(d.message || "Remove failed");
        }
      } catch (err) {
        console.error("removeItem error", err);
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, cartItems, hydrateLocalCartDetails, fetchServerCart]
  );

  const mergeLocalCart = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const local = JSON.parse(localStorage.getItem("cart") || "[]");
      if (local.length === 0) {
        await fetchServerCart();
        return;
      }

      const res = await fetch(ENDPOINTS.cartMerge, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ items: local }),
      });

      if (res.ok) {
        localStorage.removeItem("cart");
        await fetchServerCart();
        loadLocalSummary(); // now empty
      } else {
        const d = await res.json();
        alert(d.message || "Merge failed");
      }
    } catch (err) {
      console.error("mergeLocalCart error", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, fetchServerCart, loadLocalSummary]);

  // init: load local summary on mount
  useEffect(() => {
    loadLocalSummary();
  }, [loadLocalSummary]);

  // when auth changes: merge if login
  useEffect(() => {
    if (isAuthenticated) {
      mergeLocalCart();
    }
  }, [isAuthenticated, mergeLocalCart]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        localSummary,
        total,
        loading,
        fetchServerCart,
        loadLocalSummary,
        hydrateLocalCartDetails,
        addToCart,
        updateQuantity,
        updateVariant,
        removeItem,
        mergeLocalCart,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
