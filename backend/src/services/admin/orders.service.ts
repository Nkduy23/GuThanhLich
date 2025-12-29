// services/admin/orders.service.ts (new)
import { Order, OrderDetail } from "../../models";
import UserAddress from "../../models/UserAddress";
import User from "../../models/User";
import ProductVariant from "../../models/ProductVariant";
import Product from "../../models/Product";

const STATUS_PROGRESSION = {
  pending: ["confirmed", "cancelled"],
  confirmed: ["shipped"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: [],
};

export interface OrdersQuery {
  page: number;
  limit: number;
  status?: string;
  search?: string;
}

export const getOrders = async (query: OrdersQuery) => {
  const { page, limit, status, search } = query;
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { _id: { $regex: search, $options: "i" } },
      { "userId.name": { $regex: search, $options: "i" } }, // Assume populate user.name
    ];
  }

  const orders = await Order.find(filter)
    .populate("userId", "name email phone")
    .populate("addressId", "name phone address city country")
    .populate({
      path: "orderDetails",
      populate: [{ path: "variantId", populate: { path: "productId", select: "name images" } }],
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  // For table: Extract first item image, user name
  const processedOrders = orders.map((order: any) => ({
    ...order,
    firstImage: order.orderDetails?.[0]?.variantId?.productId?.images?.[0] || "/placeholder.jpg",
    customerName: order.userId?.name || "Unknown",
    itemCount: order.orderDetails?.length || 0,
  }));

  const total = await Order.countDocuments(filter);
  const pages = Math.ceil(total / limit);

  return { orders: processedOrders, total, pages };
};

export const getOrderById = async (id: string) => {
  return await Order.findById(id)
    .populate("userId", "name email phone")
    .populate("addressId", "name phone address city country")
    .populate({
      path: "orderDetails",
      populate: [
        {
          path: "variantId",
          select: "color images sizes",
          populate: {
            path: "productId",
            select: "name slug price sale",
          },
        },
      ],
    })
    .lean();
};

export const updateOrderStatus = async (id: string, newStatus: string) => {
  const order = await Order.findById(id);
  if (!order) throw new Error("Order not found");

  // Validate progression
  const currentStatus = order.status;
  const allowedNext = STATUS_PROGRESSION[currentStatus as keyof typeof STATUS_PROGRESSION];
  if (!allowedNext.includes(newStatus)) {
    throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
  }

  order.status = newStatus;
  await order.save();

  // Optional: Send email notification, update stock, etc.

  return await getOrderById(id);
};
