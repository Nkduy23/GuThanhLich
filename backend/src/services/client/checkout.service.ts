// services/client/checkout.service.ts (new file)
import Order from "../../models/Order";
import OrderDetail from "../../models/OrderDetail";

export const createOrder = async (orderData: any, cartItems: any[]) => {
  try {
    // Create order
    const order = new Order(orderData);
    await order.save();

    // Create order details
    const orderDetails = cartItems.map((item: any) => ({
      orderId: order._id,
      variantId: item.variantId, // From cart
      quantity: item.quantity,
      unit_price: item.unit_price,
      total_price: item.unit_price * item.quantity,
    }));

    await OrderDetail.insertMany(orderDetails);

    // Update stock in variants (optional: decrement quantity)
    // for (const item of cartItems) {
    //   await ProductVariant.findByIdAndUpdate(item.variantId, {
    //     $inc: { "sizes.$[size].quantity": -item.quantity },
    //   }, { arrayFilters: [{ "size.size": item.size }] });
    // }

    // Return populated order
    return await Order.findById(order._id)
      .populate("addressId", "name phone address city country")
      .populate("voucherId", "code type discountAmount")
      .populate({
        path: "orderDetails",
        populate: { path: "variantId", select: "color sizes images" },
      })
      .lean();
  } catch (err) {
    throw err;
  }
};
