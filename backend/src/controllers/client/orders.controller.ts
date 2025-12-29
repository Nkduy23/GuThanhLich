import { Request, Response } from "express";
import * as OrdersService from "../../services/client/orders.service";

export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as any).id;
    const orders = await OrdersService.getUserOrders(userId);
    res.json({ success: true, orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
