import { Response, Request } from "express";
import { getHomeData } from "../../services/client/home.service";

export const renderHome = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await getHomeData();
    res.json({ success: true, categories: data });
  } catch (error) {
    console.error("Error index renderHome:", error);
    res.status(500).send("Lỗi khi lấy dữ liệu trang Home");
  }
};
