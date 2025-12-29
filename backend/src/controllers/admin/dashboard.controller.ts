import { Request, Response } from "express";
import Order from "../../models/Order";
import User from "../../models/User";
import Product from "../../models/Product";

export const renderDashboard = async (req: Request, res: Response) => {
  try {
    // Basic totals
    const [totalUsers, totalOrders, totalProducts] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments({ is_active: true }),
    ]);

    // Revenue and sales stats
    const revenueStats = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$grandTotal" },
          avgOrderValue: { $avg: "$grandTotal" },
        },
      },
    ]);
    const totalRevenue = revenueStats[0]?.totalRevenue || 0;
    const avgOrderValue = Math.round(revenueStats[0]?.avgOrderValue || 0);

    // Monthly sales (last 12 months)
    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          total: { $sum: "$grandTotal" },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": -1, "_id.month": -1 } },
      { $limit: 12 },
    ]).then((results) => results.filter((r) => r._id.year !== null).reverse()); // Filter null, oldest first

    // Top 5 categories by sales (full lookup)
    const topCategories = await Order.aggregate([
      { $unwind: "$orderDetails" },
      {
        $lookup: {
          from: "productvariants",
          localField: "orderDetails.variantId",
          foreignField: "_id",
          as: "variant",
        },
      },
      { $unwind: "$variant" },
      {
        $lookup: {
          from: "products",
          localField: "variant.productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $lookup: {
          from: "categories",
          localField: "product.categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $group: {
          _id: "$category.name",
          totalSales: {
            $sum: { $multiply: ["$orderDetails.unit_price", "$orderDetails.quantity"] },
          },
        },
      },
      { $sort: { totalSales: -1 } },
      { $limit: 5 },
    ]);

    // Recent orders (last 5)
    const recentOrders = await Order.find()
      .populate("userId", "name")
      .populate("addressId", "name city")
      .sort({ createdAt: -1 })
      .limit(5)
      .select(" _id grandTotal status createdAt userId addressId")
      .lean();

    res.json({
      message: "Chào mừng tới Admin Dashboard",
      totals: { totalUsers, totalOrders, totalProducts },
      revenue: { totalRevenue, avgOrderValue },
      charts: {
        monthlySales: monthlySales.map((m: any) => ({
          month: `${m._id.month}/${m._id.year}`,
          total: m.total,
          count: m.count,
        })),
        topCategories: topCategories.map((c: any) => ({
          name: c._id || "Unknown",
          sales: c.totalSales,
        })),
      },
      recentOrders,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
