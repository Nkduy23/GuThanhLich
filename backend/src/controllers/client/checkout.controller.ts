import { Request, Response } from "express";
import * as CheckoutService from "../../services/client/checkout.service";
import { getCartItems, getCartSummary, clearCart } from "../../services/client/cart.service"; // Specific imports
import UserAddress from "../../models/UserAddress"; // Import models

export const getCheckout = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const addresses = await UserAddress.find({ userId }).lean();
    // Also fetch cart summary if needed
    const cartSummary = await getCartSummary(userId);
    res.json({ success: true, addresses, cartSummary });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createOrder = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const { name, phone, address, city, country, note, paymentMethod, selectedAddressId } =
      req.body;

    // Validate required fields
    if (!name || !phone || !address || !city || !country || !paymentMethod) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Get cart items with variantIds
    const cartResponse = await getCartItems(userId);
    const cartItems = cartResponse.items || [];
    if (cartItems.length === 0) {
      return res.status(400).json({ success: false, message: "Cart is empty" });
    }

    // Calculate totals
    const subtotal = cartItems.reduce(
      (acc: number, item: any) => acc + item.unit_price * item.quantity,
      0
    );
    const { appliedVoucher } = cartItems[0] || {};
    const discount = appliedVoucher?.discountAmount || 0;
    const grandTotal = subtotal - discount;

    // Create or get address
    let addressId;
    if (selectedAddressId) {
      addressId = selectedAddressId;
    } else {
      const existingAddress = await UserAddress.findOne({
        userId,
        address,
        city,
        country,
        name,
        phone,
      });
      if (existingAddress) {
        addressId = existingAddress._id;
      } else {
        const newAddress = new UserAddress({
          userId,
          name,
          phone,
          address,
          city,
          country,
        });
        await newAddress.save();
        addressId = newAddress._id;
      }
    }

    // Create order
    const orderData = {
      userId,
      addressId,
      voucherId: appliedVoucher?._id || null,
      paymentMethod,
      status: "pending", // Default: pending -> confirmed -> shipped -> delivered
      subtotal,
      discount,
      grandTotal,
      note, // Add note to order if needed (extend model?)
    };

    const order = await CheckoutService.createOrder(orderData, cartItems);
    if (!order) {
      return res.status(400).json({ success: false, message: "Failed to create order" });
    }

    // Clear cart
    await clearCart(userId);

    res.json({ success: true, message: "Order created successfully", order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
