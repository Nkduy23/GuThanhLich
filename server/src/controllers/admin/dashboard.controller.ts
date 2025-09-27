import { Request, Response } from "express";
import Dashboard from "../../models/Dashboard";

export const renderDashboard = async (req: Request, res: Response) => {
  res.json({
    message: "Chào mừng tới Admin Dashboard",
    totalUsers: 12,
    totalOrders: 34,
    totalProducts: 56,
  });
};
