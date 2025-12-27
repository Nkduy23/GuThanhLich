import { useState, useCallback, useMemo, type ReactNode } from "react";
import { toast } from "react-toastify";
import { apiRequest } from "@/api/fetcher";
import { ENDPOINTS } from "@/api/endpoints";
import { CartContext } from "./CartContext";
import { useAuth } from "@/context/auth/useAuth";
import type {
  Cart_Item,
  LocalSummary,
  BodyCartSever,
  ProductIds,
  Product,
  ProductVariant,
} from "@/features/types";

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<Cart_Item[]>([]);
  const [localSummary, setLocalSummary] = useState<LocalSummary[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [total, setTotal] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [updatingIds, setUpdatingIds] = useState(new Set<string>());

  const calculateTotal = useCallback(
    (items: Cart_Item[]) =>
      items.reduce((acc, i) => acc + (i.total_price ?? i.unit_price * i.quantity), 0),
    []
  );

  const memoTotal = useMemo(() => calculateTotal(cartItems), [cartItems, calculateTotal]);

  const memoCartCount = useMemo(
    () => cartItems.reduce((sum: number, it: Cart_Item) => sum + (it.quantity || 0), 0),
    [cartItems]
  );

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
        // Guard _id fallback
        const safeCart = (res.data.cart || []).map((itm, index) => {
          const compositeId = `${itm.productId}-${itm.variantId}-${itm.size}`;
          return {
            ...itm,
            _id: itm._id || `server-${compositeId}-${index}`,
            unit_price: itm.unit_price || 0,
            total_price: (itm.unit_price || 0) * (itm.quantity || 0),
          };
        });
        setCartItems(safeCart);
        setTotal(res.totalPrice || 0);
        const totalItems =
          res.totalItems ||
          safeCart.reduce((sum: number, it: Cart_Item) => sum + (it.quantity || 0), 0);
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
    if (isAuthenticated) {
      console.warn("hydrateLocalCartDetails skipped: User is authenticated");
      return;
    }

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
          resBatch.products.forEach((p: Product) => (productsMap[p._id] = p as ProductIds));
        } else {
          throw new Error("batch failed");
        }
      } catch {
        console.warn("hydrateLocalCartDetails: batch API failed");
      }

      const detailed = local
        .map((it: LocalSummary) => {
          const prod = productsMap[it.productId];
          if (!prod) return null;
          // find variant from populated productVariants
          const variant =
            (prod.productVariants || []).find(
              (v: LocalSummary) => v._id.toString() === it.variantId
            ) || ({} as ProductVariant);

          // filter availableSizes >0 stock
          const availableSizes =
            variant.sizes
              ?.filter((s: LocalSummary) => s.quantity > 0)
              .map((s: LocalSummary) => s.size) || [];

          // Guard: Đảm bảo unit_price và total_price là number
          const safeUnitPrice = it.unit_price || 0;

          return {
            _id: `${it.productId}-${it.variantId}-${it.size}`,
            productId: it.productId,
            variantId: it.variantId,
            name: prod.name,
            image: variant.images?.[0] || prod.images?.[0] || "",
            color: variant.color || "",
            size: it.size,
            quantity: it.quantity || 0,
            unit_price: safeUnitPrice,
            total_price: safeUnitPrice * (it.quantity || 0),
            availableColors: (prod.productVariants || []).map((v: LocalSummary) => ({
              color: v.color,
              variantId: v._id.toString(),
            })),
            availableSizes,
            price: 0,
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
  }, [calculateTotal, isAuthenticated]);

  const addToCart = useCallback(
    async (item: Cart_Item) => {
      setLoading(true);

      try {
        if (!isAuthenticated) {
          const local: Cart_Item[] = JSON.parse(localStorage.getItem("cart") || "[]");

          const idx = local.findIndex(
            (i) => i.variantId === item.variantId && i.size === item.size
          );

          if (idx > -1) {
            local[idx].quantity += item.quantity;
          } else {
            const safeItem = { ...item, unit_price: item.unit_price || 0 };
            local.push(safeItem);
          }

          localStorage.setItem("cart", JSON.stringify(local));

          const newTotal = local.reduce((sum: number, it) => {
            const safePrice = it.unit_price || 0;
            return sum + safePrice * (it.quantity || 0);
          }, 0);

          const newCount = local.reduce(
            (sum: number, it: Cart_Item) => sum + (it.quantity || 0),
            0
          );

          const safeLocalItems = local.map((it) => ({
            ...it,
            unit_price: it.unit_price || 0,
            total_price: (it.unit_price || 0) * (it.quantity || 0),
          }));

          setCartItems(safeLocalItems);
          setTotal(newTotal);
          setCartCount(newCount);

          return;
        }

        const optimisticItems = [...cartItems, { ...item, unit_price: item.unit_price || 0 }];
        const optimisticTotal = calculateTotal(optimisticItems);
        const optimisticCount = memoCartCount + (item.quantity || 0);

        setCartItems(optimisticItems);
        setTotal(optimisticTotal);
        setCartCount(optimisticCount);

        // Send to server
        const res = await apiRequest<{ success: boolean; message: string }>(ENDPOINTS.cartAdd, {
          method: "POST",
          body: JSON.stringify(item),
        });

        if (res.success) {
          await fetchServerCart();
        } else {
          throw new Error(res.message);
        }
      } catch (error) {
        console.error("addToCart error:", error);
        await fetchServerCart();
      } finally {
        setLoading(false);
      }
    },
    [isAuthenticated, fetchServerCart, calculateTotal, cartItems, memoCartCount]
  );

  const removeItem = useCallback(
    async (id: string) => {
      const itemIndex = cartItems.findIndex((i) => i._id === id);
      if (itemIndex === -1) return;

      const oldItems = [...cartItems];

      const newItems = cartItems.filter((i) => i._id !== id);
      setCartItems(newItems);

      setTotal(calculateTotal(newItems));
      setCartCount(newItems.reduce((sum, it) => sum + (it.quantity || 0), 0));

      try {
        if (!isAuthenticated) {
          // Local mode
          const local = JSON.parse(localStorage.getItem("cart") || "[]");
          const current = cartItems[itemIndex];
          const lIndex = local.findIndex(
            (l: LocalSummary) =>
              l.productId === current.productId &&
              l.variantId === current.variantId &&
              l.size === current.size
          );

          if (lIndex > -1) {
            local.splice(lIndex, 1);
            localStorage.setItem("cart", JSON.stringify(local));
          }

          toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
          return;
        }

        // Server mode
        const res = await fetch(`${ENDPOINTS.cart}/${id}`, {
          method: "DELETE",
          credentials: "include",
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          setCartItems(oldItems);
          setTotal(calculateTotal(oldItems));
          setCartCount(oldItems.reduce((sum, it) => sum + (it.quantity || 0), 0));
          toast.error(data.message || "Xóa thất bại, vui lòng thử lại");
          return;
        }

        toast.success("Xóa sản phẩm thành công");
      } catch (err) {
        console.error("removeItem error:", err);
        setCartItems(oldItems);
        setTotal(calculateTotal(oldItems));
        setCartCount(oldItems.reduce((sum, it) => sum + (it.quantity || 0), 0));
        toast.error("Có lỗi xảy ra khi xóa sản phẩm");
      }
    },
    [isAuthenticated, cartItems, calculateTotal]
  );

  const updateQuantity = useCallback(
    async (id: string, quantity: number) => {
      if (quantity === 0) {
        return removeItem(id);
      }

      const itemIndex = cartItems.findIndex((i) => i._id === id);

      if (itemIndex === -1) return;

      // Lưu state cũ để revert nếu cần
      const oldItems = [...cartItems];

      // Add to updatingIds cho granular loading (không dùng global loading)
      setUpdatingIds((prev) => new Set([...prev, id]));

      // OPTIMISTIC: Cập nhật UI ngay lập tức (không chờ API)
      // Cũng update total_price cho item để total memoized update mượt
      setCartItems((prev) => {
        const newItems = [...prev];
        const updatedItem = { ...newItems[itemIndex], quantity };
        const safeUnitPrice = updatedItem.unit_price || 0;
        updatedItem.total_price = safeUnitPrice * quantity;
        newItems[itemIndex] = updatedItem;
        return newItems;
      });

      // Xử lý async ở background
      (async () => {
        try {
          if (!isAuthenticated) {
            // Local mode: Cập nhật local storage ngay
            const local = JSON.parse(localStorage.getItem("cart") || "[]");
            const current = cartItems[itemIndex];
            const lIndex = local.findIndex(
              (l: LocalSummary) =>
                l.productId === current.productId &&
                l.variantId === current.variantId &&
                l.size === current.size
            );

            if (lIndex > -1) {
              local[lIndex].quantity = quantity;
              // Guard: Nếu unit_price undefined ở local, set default (nhưng thường đã có từ addToCart)
              if (local[lIndex].unit_price === undefined) {
                local[lIndex].unit_price = 0;
              }
              localStorage.setItem("cart", JSON.stringify(local));
            }
            toast.success("Cập nhật số lượng thành công");
            return;
          }

          // Server mode: Gửi PUT request
          const res = await apiRequest<{ success: boolean; message: string }>(
            `${ENDPOINTS.cart}/${id}`,
            {
              method: "PUT",
              body: JSON.stringify({ quantity }),
            }
          );

          if (!res.success) {
            // Revert optimistic update nếu server lỗi (ví dụ: hết hàng)
            setCartItems((prev) => {
              const reverted = [...prev];
              const oldItem = { ...oldItems[itemIndex] };
              const safeOldUnitPrice = oldItem.unit_price || 0;
              oldItem.total_price = safeOldUnitPrice * oldItem.quantity;
              reverted[itemIndex] = oldItem;
              return reverted;
            });
            toast.error(res.message || "Cập nhật thất bại");
            return;
          }

          // Nếu server trả về price mới hoặc stock, bạn có thể update item từ res.data nếu API hỗ trợ
          toast.success("Cập nhật số lượng thành công");
        } catch (err) {
          // Revert nếu lỗi network
          setCartItems(oldItems);
          toast.error("Cập nhật số lượng thất bại, vui lòng thử lại.");
          console.error("updateQuantity error", err);
        } finally {
          // Remove from updatingIds
          setUpdatingIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
          });
        }
      })();
    },
    [isAuthenticated, cartItems, removeItem]
  );

  const updateVariant = useCallback(
    async (id: string, variantId: string, size: string, quantity?: number) => {
      const itemIndex = cartItems.findIndex((i) => i._id === id);
      if (itemIndex === -1) {
        return;
      }

      const oldCartItems = [...cartItems];
      const oldItem = { ...cartItems[itemIndex] };

      setUpdatingIds((prev) => new Set([...prev, id]));

      const updatedItems = [...cartItems];
      updatedItems[itemIndex] = {
        ...oldItem,
        variantId,
        size,
        ...(quantity !== undefined && { quantity }),
      };

      setCartItems(updatedItems);

      // Xử lý async ở background
      (async () => {
        try {
          if (!isAuthenticated) {
            // Local mode: Cập nhật local storage (tìm bằng old fields, update variant/size)
            const local = JSON.parse(localStorage.getItem("cart") || "[]");
            const current = cartItems[itemIndex]; // Old current để match
            const lIndex = local.findIndex(
              (l: LocalSummary) =>
                l.productId === current.productId &&
                l.variantId === current.variantId &&
                l.size === current.size
            );

            if (lIndex > -1) {
              local[lIndex].variantId = variantId;
              local[lIndex].size = size;

              if (quantity !== undefined) local[lIndex].quantity = quantity;
              // Guard: Nếu unit_price undefined ở local, set default
              if (local[lIndex].unit_price === undefined) {
                local[lIndex].unit_price = 0;
              }
              localStorage.setItem("cart", JSON.stringify(local));
            }
            // Gọi hydrate để refresh details (image, color, availableSizes) - chấp nhận flash nhỏ cho variant change
            await hydrateLocalCartDetails();
            toast.success("Cập nhật sản phẩm thành công");
            return;
          }

          // Server mode
          const body: BodyCartSever = { variantId, size, quantity };

          // Type res để lấy full cart từ API
          const res = await apiRequest<{
            success: boolean;
            message: string;
            cart?: Cart_Item[];
            totalPrice?: number;
            totalItems?: number;
          }>(`${ENDPOINTS.cart}/${id}`, {
            method: "PUT",
            body: JSON.stringify(body),
          });

          if (res.success) {
            // Sync full từ res (không cần fetchServerCart riêng) - update details như image/color
            // Guard: Đảm bảo res.cart items có unit_price/total_price + _id (fallback composite nếu server miss)
            if (res.cart !== undefined) {
              setCartItems(res.cart);
            }
            if (res.totalPrice !== undefined) {
              setTotal(res.totalPrice);
            }
            if (res.totalItems !== undefined) {
              setCartCount(res.totalItems);
            }

            toast.success("Cập nhật sản phẩm thành công");
          } else {
            // Revert optimistic (bao gồm _id nếu local, nhưng server không thay _id)
            setCartItems(oldCartItems);
            toast.error(res.message || "Cập nhật sản phẩm thất bại");
          }
        } catch (err) {
          toast.error("Cập nhật sản phẩm thất bại, vui lòng thử lại.");
          setCartItems(oldCartItems); // Revert
          console.error("updateVariant error", err);
        } finally {
          // Remove from updatingIds (dùng old id)
          setUpdatingIds((prev) => {
            const newSet = new Set(prev);
            newSet.delete(id);
            return newSet;
          });
        }
      })();
    },
    [isAuthenticated, cartItems, hydrateLocalCartDetails]
  );

  const removeAllItems = useCallback(async () => {
    const oldItems = [...cartItems];

    setCartItems([]);
    setTotal(0);
    setCartCount(0);
    toast.success("Đã xóa toàn bộ giỏ hàng");

    try {
      if (!isAuthenticated) {
        localStorage.removeItem("cart");
        return;
      }

      const res = await fetch(ENDPOINTS.cartRemoveAll, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setCartItems(oldItems);
        toast.error(data.message || "Xóa thất bại, vui lòng thử lại");
      }
    } catch (err) {
      console.error("removeAllItems error", err);
      setCartItems(oldItems);
      toast.error("Có lỗi xảy ra khi xóa giỏ hàng");
    } finally {
      setLoading(false);
    }
  }, [cartItems, isAuthenticated]);

  const mergeLocalCart = useCallback(async () => {
    if (!isAuthenticated) return; // Không merge nếu chưa auth
    setLoading(true);
    try {
      const local = JSON.parse(localStorage.getItem("cart") || "[]");
      if (local.length === 0) {
        await fetchServerCart();
        return;
      }

      console.log("Merging local cart:", local);

      const res = await fetch(ENDPOINTS.cartMerge, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ items: local }),
      });

      console.log("Merge response:", res.status, await res.json());

      if (res.ok) {
        localStorage.removeItem("cart");
        await fetchServerCart(); // Sync server cart (có merged items, _id là ObjectId)
        loadLocalSummary(); // Empty localSummary
        toast.success("Đã đồng bộ giỏ hàng");
      } else {
        // ✅ Fix: Không gọi hydrate khi auth - tránh set composite _id
        const d = await res.json();
        console.error("Merge failed:", d.message);
        toast.error(
          d.message || "Không thể đồng bộ - Giỏ hàng local sẽ bị xóa, vui lòng thêm lại sản phẩm"
        );

        // Clear local để tránh stale, nhưng giữ server cart (có thể thiếu items)
        localStorage.removeItem("cart");
        await fetchServerCart(); // Refresh server cart sạch (ObjectId _id)
        loadLocalSummary(); // Empty
      }
    } catch (err) {
      console.error("mergeLocalCart error", err);
      // ✅ Tương tự: Không hydrate, chỉ fetch server + clear local
      toast.error("Lỗi đồng bộ - Giỏ hàng local bị xóa, vui lòng thêm lại");
      localStorage.removeItem("cart");
      await fetchServerCart();
      loadLocalSummary();
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, fetchServerCart, loadLocalSummary]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        localSummary,
        total: memoTotal,
        loading,
        updatingIds,
        fetchServerCart,
        loadLocalSummary,
        hydrateLocalCartDetails,
        addToCart,
        updateQuantity,
        updateVariant,
        removeItem,
        removeAllItems,
        mergeLocalCart,
        cartCount: memoCartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
