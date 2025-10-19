import { Request, Response } from "express";
import {
  getAvailableVouchers,
  applyVoucherToCart,
  removeVoucherFromCart,
} from "../../services/client/voucher.service";

import { getCartItems } from "../../services/client/cart.service";

export const getAvailableVouchersHandler = async (req: Request, res: Response) => {
  const userId = (req.user as any)?.id;
  const { total } = req.query;

  try {
    const cartTotal = parseInt(total as string) || 0;

    // console.log("🧾 [VoucherHandler] userId:", userId);
    // console.log("🧾 [VoucherHandler] cartTotal:", cartTotal);

    const vouchers = await getAvailableVouchers(userId, cartTotal);

    // console.log("🎯 [VoucherHandler] vouchers found:", vouchers.length);

    // if (vouchers.length > 0) {
    //   console.log("✅ First voucher:", vouchers[0]);
    // }

    res.json({ success: true, vouchers });
  } catch (error: any) {
    console.error("❌ [VoucherHandler] Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const applyVoucherHandler = async (req: Request, res: Response) => {
  const userId = (req.user as any).id;
  const { code } = req.body;

  try {
    const { items, totalPrice } = await getCartItems(userId);
    console.log("🛒 totalPrice from getCartItems:", Number(totalPrice));

    const result = await applyVoucherToCart({ userId, code, cartTotal: Number(totalPrice) || 0 });

    if (result.success) {
      // Refresh cart with discount
      const {
        items: updatedItems,
        totalItems,
        totalPrice: updatedTotal,
      } = await getCartItems(userId);
      res.json({
        success: true,
        message: result.message,
        cart: updatedItems,
        totalItems,
        totalPrice: updatedTotal - (result.discountAmount || 0), // Apply discount in response
        ...result,
      });
    } else {
      res.status(400).json(result);
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const removeVoucherHandler = async (req: Request, res: Response) => {
  const userId = (req.user as any).id;

  try {
    await removeVoucherFromCart(userId);
    const { items, totalItems, totalPrice } = await getCartItems(userId);
    res.json({ success: true, cart: items, totalItems, totalPrice });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
