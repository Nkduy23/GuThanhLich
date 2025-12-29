import { Router } from "express";
import {
  getProduct,
  getProductDetail,
  getProductById,
  getBatch,
} from "../../controllers/client/product.controller";

const router = Router();

router.get("/", getProduct);
router.post("/batch", getBatch);
router.get("/:slug", getProductDetail);
router.get("/id/:id", getProductById);

export default router;
