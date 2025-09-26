import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json([
    { id: 1, productId: 101, rating: 5, review: "Rất hài lòng với sản phẩm!" },
    { id: 2, productId: 102, rating: 4, review: "Chất lượng ổn, giá hợp lý." },
    { id: 3, productId: 103, rating: 3, review: "Sản phẩm tạm được, giao hàng nhanh." },
  ]);
});

export default router;
