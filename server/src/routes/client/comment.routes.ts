import { Router, Request, Response } from "express";
// import { getComment } from "../controllers/comment.controller";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json([
    { id: 1, user: "Nguyễn Văn A", comment: "Sản phẩm rất tốt!", productId: 101 },
    { id: 2, user: "Trần Thị B", comment: "Chất lượng ổn so với giá.", productId: 102 },
    { id: 3, user: "Lê Văn C", comment: "Đóng gói đẹp, giao hàng nhanh.", productId: 101 },
  ]);
});

export default router;
