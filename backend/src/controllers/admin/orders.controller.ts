import { Request, Response } from "express";
import * as AdminOrdersService from "../../services/admin/orders.service";

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, status, search } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    const orders = await AdminOrdersService.getOrders({
      page: pageNum,
      limit: limitNum,
      status: status as string,
      search: search as string,
    });

    res.json({ success: true, orders: orders.orders, total: orders.total, pages: orders.pages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await AdminOrdersService.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await AdminOrdersService.updateOrderStatus(req.params.id, status);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, message: "Status updated successfully", order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
