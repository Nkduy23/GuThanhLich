// services/client/cart.service.ts
import mongoose from "mongoose";
import CartItem from "../../models/CartItem";
import ProductVariant from "../../models/ProductVariant";
import Product from "../../models/Product"; // Add import Product để populate variants
import User from "../../models/User"; // Để validate userId

// Interface cho add/update input
export interface AddToCartInput {
  productId: string;
  variantId: string;
  unit_price: any;
  size: string;
  quantity: number;
}

export interface UpdateCartInput {
  // New: Cho update
  variantId?: string;
  size?: string;
  quantity?: number;
}

interface LocalCartItem {
  productId: string;
  variantId: string;
  size: string;
  quantity: number;
  price?: number;
  name?: string;
  image?: string;
}

export const validateSizeAvailability = async (
  variantId: string,
  size: string,
  quantity: number
) => {
  const variant = await ProductVariant.findById(variantId);
  if (!variant) {
    return { valid: false, message: "Variant không tồn tại" };
  }

  const sizeObj = variant.sizes.find((s: any) => s.size === size);
  if (!sizeObj || sizeObj.quantity < quantity) {
    return {
      valid: false,
      message: `Size ${size} không đủ hàng (chỉ còn ${sizeObj?.quantity || 0}) sản phẩm`,
    };
  }

  return { valid: true };
};

export const addToCartService = async (userId: string, input: AddToCartInput) => {
  const { productId, variantId, size, quantity, unit_price } = input;

  // Validate size
  const sizeValidation = await validateSizeAvailability(variantId, size, quantity);
  if (!sizeValidation.valid) {
    return { success: false, message: sizeValidation.message };
  }

  // Check existing item
  let cartItem = await CartItem.findOne({
    userId,
    productId,
    variantId,
    size,
  });

  if (cartItem) {
    // Update quantity
    cartItem.quantity += quantity;
    await cartItem.save();
  } else {
    // Create new
    cartItem = new CartItem({
      userId,
      productId,
      variantId,
      size,
      quantity,
      unit_price,
    });
    await cartItem.save();
  }

  return { success: true, cartItem };
};

export const getCartItems = async (userId: string) => {
  const items = await CartItem.find({ userId })
    .populate({
      path: "productId",
      select: "name price sale slug images productVariants",
      populate: {
        path: "productVariants",
        model: "ProductVariant",
        match: { is_active: true },
      },
    })
    .populate("variantId", "color images sizes");

  const transformed = await Promise.all(
    items.map(async (item: any) => {
      const product = item.productId;
      const variant = item.variantId;

      const availableColors =
        product.productVariants?.map((v: any) => ({
          color: v.color,
          variantId: v._id.toString(),
        })) || [];

      const availableSizes =
        variant?.sizes?.filter((s: any) => s.quantity > 0).map((s: any) => s.size) || [];

      const appliedVoucher = item.appliedVoucher
        ? {
            code: item.appliedVoucher.code,
            type: item.appliedVoucher.type,
            discountAmount: Number(item.appliedVoucher.discountAmount) || 0,
          }
        : null;

      let adjustedTotalPrice = Number(item.unit_price) * Number(item.quantity);

      if (appliedVoucher) {
        adjustedTotalPrice -= appliedVoucher.discountAmount;
      }

      return {
        _id: item._id.toString(),
        name: product.name,
        unit_price: Number(item.unit_price),
        quantity: Number(item.quantity),
        size: item.size,
        color: variant?.color,
        image: variant?.images?.[0] || product.images?.[0],
        variantId: variant?._id.toString(),
        productId: product._id.toString(),
        total_price: adjustedTotalPrice,
        availableColors,
        availableSizes,
        appliedVoucher,
      };
    })
  );

  const totalItems = transformed.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const totalPrice = transformed.reduce((sum, item) => sum + Number(item.total_price || 0), 0);

  return { success: true, items: transformed, totalItems, totalPrice };
};

// Update cart item (refactor: hỗ trợ variantId, size, quantity)
export const updateCartItemService = async (
  // Đổi tên param: quantity → updates
  userId: string,
  cartItemId: string,
  updates: UpdateCartInput
) => {
  // ✅ Validate: Kiểm tra cartItemId là valid ObjectId trước query
  if (!mongoose.isValidObjectId(cartItemId)) {
    return { success: false, message: "ID item không hợp lệ (phải là ObjectId từ server)" };
  }

  console.log("Updating cartItemId:", cartItemId); // Debug

  const cartItem = await CartItem.findOne({ _id: cartItemId, userId });
  if (!cartItem) {
    return { success: false, message: "Item không tồn tại" };
  }

  let newVariantId = cartItem.variantId.toString();
  let newSize = cartItem.size;
  let newQuantity = cartItem.quantity;

  // Nếu thay variantId (change color)
  if (updates.variantId && updates.variantId !== newVariantId) {
    const newVariant = await ProductVariant.findById(updates.variantId);
    if (!newVariant || !newVariant.is_active) {
      return { success: false, message: "Variant mới không hợp lệ" };
    }
    newVariantId = updates.variantId;

    // Update fields từ variant mới
    cartItem.color = newVariant.color; // Add color field vào model nếu chưa có? (hoặc populate sau)
    cartItem.image = newVariant.images[0]; // Tương tự, nếu model có image
    // Unit price: Refetch từ product (vì sale có thể change)
    const product = await Product.findById(cartItem.productId);
    const finalPrice =
      product?.sale && product.sale > 0
        ? product.price - (product.price * product.sale) / 100
        : product.price;
    cartItem.unit_price = finalPrice;
  }

  // Nếu thay size
  if (updates.size && updates.size !== newSize) {
    newSize = updates.size;
    // Validate stock với variant mới
    const sizeValidation = await validateSizeAvailability(newVariantId, newSize, newQuantity);
    if (!sizeValidation.valid) {
      return { success: false, message: sizeValidation.message };
    }
  }

  // Quantity
  if (updates.quantity !== undefined && updates.quantity >= 1) {
    newQuantity = updates.quantity;
    // Re-validate stock với size/variant mới
    const sizeValidation = await validateSizeAvailability(newVariantId, newSize, newQuantity);
    if (!sizeValidation.valid) {
      return { success: false, message: sizeValidation.message };
    }
  } else if (updates.quantity === 0) {
    // Optional: remove nếu quantity=0
    await CartItem.findByIdAndDelete(cartItemId);
    return { success: true, message: "Item đã xóa" };
  }

  // Save changes
  cartItem.variantId = new mongoose.Types.ObjectId(newVariantId);
  cartItem.size = newSize;
  cartItem.quantity = newQuantity;
  // total_price sẽ auto tính ở pre-save hook
  await cartItem.save();

  return { success: true, cartItem };
};

// Remove item (giữ nguyên)
export const removeCartItem = async (userId: string, cartItemId: string) => {
  const cartItem = await CartItem.findOneAndDelete({ _id: cartItemId, userId });
  if (!cartItem) {
    return { success: false, message: "Item không tồn tại" };
  }
  return { success: true };
};

export const removeAllItemsService = async (userId: string) => {
  return await CartItem.deleteMany({ userId });
};

/**
 * localItems: Array of { productId, variantId, size, quantity }
 */
export const mergeCartService = async (userId: string, localItems: Array<any>) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    for (const item of localItems) {
      const { productId, variantId, size, quantity } = item;
      if (!variantId || !productId || !size || !quantity) continue;

      // Validate variant exists and (optionally) stock
      const variant = await ProductVariant.findById(variantId).session(session);
      if (!variant) {
        // nếu variant không tồn tại, bỏ qua item đó
        continue;
      }

      // Nếu bạn có thông tin stock trên variant, giới hạn tổng quantity
      const maxStock = (variant as any).stock ?? Number.MAX_SAFE_INTEGER;

      // Tìm item đã có trong DB với cùng user + variant + size
      const existing = await CartItem.findOne({
        userId,
        variantId,
        size,
      }).session(session);

      if (existing) {
        // Cộng dồn, nhưng không vượt quá tồn kho (nếu mong muốn)
        const newQty = Math.min(existing.quantity + Number(quantity), maxStock);
        existing.quantity = newQty;
        await existing.save({ session });
      } else {
        // Tạo mới (theo model: userId, productId, variantId, size, quantity)
        // New: Add unit_price từ product (tương tự addToCart)
        const product = await Product.findById(productId).session(session);
        const finalPrice =
          product?.sale && product.sale > 0
            ? product.price - (product.price * product.sale) / 100
            : product.price;
        const insertedQty = Math.min(Number(quantity), maxStock);
        await CartItem.create(
          [
            {
              userId,
              productId,
              variantId,
              size,
              quantity: insertedQty,
              unit_price: finalPrice, // Add này
            },
          ],
          { session }
        );
      }
    }

    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    console.error("mergeCartService error:", err);
    throw err;
  } finally {
    session.endSession();
  }
};

/** Optional: lấy cart đầy đủ (server mode) */
export const getCartItemsService = async (userId: string) => {
  // Populate product/variant nếu cần để trả về dữ liệu hiển thị
  const items = await CartItem.find({ userId }).populate("productId").populate("variantId").lean();
  // Có thể tính total ở đây nếu cần
  return items;
};
