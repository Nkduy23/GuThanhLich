// controllers/client/cart.controller.ts
import { Request, Response } from "express";
import {
  addToCartService,
  getCartItems,
  updateCartItemService,
  removeCartItem as removeCartItemService,
  removeAllItemsService,
  AddToCartInput,
  mergeCartService,
  getCartItemsService,
} from "../../services/client/cart.service";

export const getCart = async (req: Request, res: Response) => {
  const userId = (req.user as any).id;

  try {
    const result = await getCartItems(userId);
    return res.json({
      success: true,
      data: {
        cart: result.items.map((item) => ({
          _id: item._id,
          productId: item.productId,
          name: item.name,
          image: item.image,
          color: item.color,
          size: item.size,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.total_price,
          availableColors: item.availableColors || [],
          availableSizes: item.availableSizes || [],
          appliedVoucher: item.appliedVoucher,
        })),
      },
      totalItems: result.totalItems,
      totalPrice: result.totalPrice,
    });
  } catch (error) {
    console.error("Get cart error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

export const addToCart = async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  const input: AddToCartInput = req.body;

  if (!input.productId || !input.variantId || !input.size || !input.quantity || !input.unit_price) {
    return res.status(400).json({ success: false, message: "Thiếu thông tin sản phẩm" });
  }

  try {
    const result = await addToCartService(userId, input);
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    // Trả cart mới sau add (optional, để FE update UI)
    const { items, totalItems, totalPrice } = await getCartItems(userId);
    return res.json({
      success: true,
      message: "Thêm vào giỏ hàng thành công",
      cart: items, // Consistent với getCart
      totalItems,
      totalPrice,
    });
  } catch (error) {
    console.error("Add to cart error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Update quantity/variant/size
export const updateCartItem = async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  const { id } = req.params; // Fix: dùng id từ route :id
  const updates = req.body; // { variantId?, size?, quantity? }

  console.log(updates);

  if (!updates.variantId && !updates.size && updates.quantity === undefined) {
    // Fix: check quantity !== undefined
    return res.status(400).json({ success: false, message: "Không có thay đổi nào" });
  }

  try {
    const result = await updateCartItemService(userId, id, updates); // Pass id
    if (!result.success) {
      return res.status(400).json({ success: false, message: result.message });
    }

    // Refresh cart
    const { items, totalItems, totalPrice } = await getCartItems(userId);
    return res.json({
      success: true,
      message: "Cập nhật thành công",
      cart: items, // Consistent
      totalItems,
      totalPrice,
    });
  } catch (error: any) {
    console.error("Update cart error:", error);
    return res.status(500).json({ success: false, message: error.message || "Lỗi server" });
  }
};

// Remove item
export const removeCartItem = async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  const { id } = req.params;

  try {
    const result = await removeCartItemService(userId, id);
    if (!result.success) {
      return res.status(404).json({ success: false, message: result.message });
    }

    // Refresh cart
    const { items, totalItems, totalPrice } = await getCartItems(userId);
    return res.json({
      success: true,
      message: "Xóa thành công",
      cart: items,
      totalItems,
      totalPrice,
    });
  } catch (error) {
    console.error("Remove cart error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Remove all
export const removeAllItems = async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  console.log(userId);
  try {
    const result = await removeAllItemsService(userId);

    // Refresh cart
    const { items, totalItems, totalPrice } = await getCartItems(userId);
    return res.json({
      success: true,
      message: "Xóa tất cả sản phẩm trong giỏ hàng thành công",
      cart: items,
      totalItems,
      totalPrice,
    });
  } catch (error) {
    console.error("Remove all items error:", error);
    return res.status(500).json({ success: false, message: "Lỗi server" });
  }
};

// Merge Cart
export const mergerCart = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const { items } = req.body;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items to merge" });
    }

    await mergeCartService(userId, items);

    const { items: cartItems, totalItems, totalPrice } = await getCartItems(userId); // Fix: dùng getCartItems để consistent

    return res.status(200).json({
      success: true, // Add success cho unified
      message: "Cart merged successfully",
      cart: cartItems,
      totalItems,
      totalPrice,
    });
  } catch (error) {
    console.error("Merge cart error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
