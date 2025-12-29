// services/client/orders.service.ts (new)
import Order from "../../models/Order";
import OrderDetail from "../../models/OrderDetail";
import ProductVariant from "../../models/ProductVariant";
import UserAddress from "../../models/UserAddress";

export const getUserOrders = async (userId: string) => {
  const orders = await Order.find({ userId })
    .sort({ createdAt: -1 }) // Latest first
    .populate("addressId", "name phone address city country")
    .populate({
      path: "orderDetails",
      populate: {
        path: "variantId",
        select: "color images",
      },
    })
    .lean();

  return orders;
};
