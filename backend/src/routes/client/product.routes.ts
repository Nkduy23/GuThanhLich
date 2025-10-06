import { Router } from "express";
import { getProduct, getProductDetail, getRelated } from "../../controllers/client/product.controller";

const router = Router();

router.get("/", getProduct);
router.get("/:slug", getProductDetail);
router.get("/:slug/related", getRelated);
export default router;
