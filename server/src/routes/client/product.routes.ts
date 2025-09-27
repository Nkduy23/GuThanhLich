import { Router } from "express";
import { getProduct, getProductDetail, getProductVariants, getProductVariantImages, getHighlight, getRelated } from "../../controllers/client/product.controller";

const router = Router();

router.get("/", getProduct);
router.get("/:slug", getProductDetail);
router.get("/:slug/variant", getProductVariants);
router.get("/:slug/variant_image", getProductVariantImages);
router.get("/:slug/highlight", getHighlight);
router.get("/:slug/related", getRelated);
export default router;
