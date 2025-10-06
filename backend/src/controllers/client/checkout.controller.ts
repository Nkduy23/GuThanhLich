import { Request, Response } from "express";
// import Checkout from "../../models/Checkout";

export const getCheckout = async (req: Request, res: Response) => {
  try {
    const response = res.json({
      duy: "Duy",
    });
    return { success: true, response };
  } catch (error) {
    console.error("Lỗi khi checkout", error);
  }
};
