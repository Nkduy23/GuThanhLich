// services/voucher.service.ts
import Voucher, { IVoucher } from "../../models/Voucher";
import CartItem from "../../models/CartItem";

interface ApplyVoucherInput {
  userId: string;
  code: string;
  cartTotal: number;
}

interface ApplyVoucherResult {
  success: boolean;
  message: string;
  voucher?: Partial<IVoucher> & { discountAmount: number };
  discountAmount?: number;
}

export const getAvailableVouchers = async (
  userId: string,
  cartTotal: number | string
): Promise<IVoucher[]> => {
  const now = new Date();
  const total = Number(cartTotal);

  const query = {
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
    minTotal: { $lte: total },
    $expr: {
      $gt: [{ $ifNull: ["$usageLimit", 0] }, { $ifNull: ["$usedCount", 0] }],
    },
  };

  console.log("🧩 [getAvailableVouchers] Query:", JSON.stringify(query, null, 2));

  const result = await Voucher.find(query);
  console.log("📦 [getAvailableVouchers] Result count:", result.length);

  return result;
};

// services/voucher.service.ts (Fixed with guards for NaN/undefined)
export const applyVoucherToCart = async ({
  userId,
  code,
  cartTotal,
}: ApplyVoucherInput): Promise<ApplyVoucherResult> => {
  const voucher = await Voucher.findOne({ code, isActive: true });
  if (!voucher) {
    return { success: false, message: "Mã voucher không hợp lệ hoặc đã hết hạn" };
  }

  const now = new Date();
  if (now < voucher.startDate || now > voucher.endDate) {
    return { success: false, message: "Voucher chưa hiệu lực hoặc đã hết hạn" };
  }

  // ✅ Guard: Ensure cartTotal is valid number
  const safeCartTotal = Number(cartTotal) || 0;
  if (safeCartTotal < voucher.minTotal) {
    return {
      success: false,
      message: `Đơn hàng cần tối thiểu ${voucher.minTotal.toLocaleString("vi-VN")}đ`,
    };
  }

  if (voucher.usedCount >= voucher.usageLimit) {
    return { success: false, message: "Voucher đã hết lượt sử dụng" };
  }

  // Calculate discount with guard
  let discountAmount: number;
  if (voucher.type === "fixed") {
    discountAmount = voucher.value;
  } else {
    // percentage
    discountAmount = (safeCartTotal * voucher.value) / 100;
    if (voucher.maxDiscountValue) {
      discountAmount = Math.min(discountAmount, voucher.maxDiscountValue);
    }
  }

  // ✅ Guard: Ensure discountAmount is valid number
  if (isNaN(discountAmount) || discountAmount <= 0) {
    return { success: false, message: "Không thể tính giá giảm" };
  }

  // Apply to cart: Update first CartItem with discount info
  const cartItems = await CartItem.find({ userId });
  if (cartItems.length === 0) {
    return { success: false, message: "Giỏ hàng trống" };
  }

  // Update first item
  cartItems[0].appliedVoucher = {
    code: voucher.code,
    discountAmount: discountAmount, // Safe number
    type: voucher.type,
  };
  await cartItems[0].save();

  // Increment usedCount
  voucher.usedCount += 1;
  await voucher.save();

  return {
    success: true,
    message: "Áp dụng voucher thành công",
    voucher: { ...voucher.toObject(), discountAmount },
    discountAmount,
  };
};

export const removeVoucherFromCart = async (userId: string): Promise<boolean> => {
  const cartItems = await CartItem.find({ userId });
  if (cartItems.length > 0) {
    cartItems[0].appliedVoucher = undefined;
    await cartItems[0].save();
  }
  return true;
};
