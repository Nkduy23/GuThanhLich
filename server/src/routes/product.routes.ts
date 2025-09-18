import { Router } from "express";
import { getProduct, getProductDetail } from "../controllers/product.controller";

const router = Router();

router.get("/", getProduct);
router.get("/:id", getProductDetail);

export default router;
