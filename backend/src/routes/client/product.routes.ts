import { Router } from "express";
import {
  getProduct,
  getProductDetail,
  getProductById,
  getBatchTest,
} from "../../controllers/client/product.controller";

const router = Router();

router.get("/", getProduct); // Chưa sài
router.post("/batch", getBatchTest);
router.get("/:slug", getProductDetail);
router.get("/id/:id", getProductById);

export default router;
