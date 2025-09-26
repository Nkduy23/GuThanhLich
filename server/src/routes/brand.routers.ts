import { Router, Request, Response } from "express";

const router = Router();

// GET /api/brand
router.get("/", (req: Request, res: Response) => {
  res.json([
    { id: 1, name: "GuThanhLich", country: "Việt Nam" },
    { id: 2, name: "Nature Beauty", country: "Hàn Quốc" },
    { id: 3, name: "Luxury Care", country: "Pháp" },
  ]);
});

export default router;
