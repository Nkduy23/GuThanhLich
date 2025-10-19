import { Router } from "express";
import { verifyTokenMiddleware } from "../../middlewares/verifyToken.middleware";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  removeAllItems,
  mergerCart,
} from "../../controllers/client/cart.controller";
import {
  getAvailableVouchersHandler,
  applyVoucherHandler,
  removeVoucherHandler,
} from "../../controllers/client/voucher.controller";

const router = Router();

router.get("/", verifyTokenMiddleware, getCart);

router.post("/add", verifyTokenMiddleware, addToCart);

router.delete("/remove-all", verifyTokenMiddleware, removeAllItems);

router.put("/:id", verifyTokenMiddleware, updateCartItem);

router.delete("/:id", verifyTokenMiddleware, removeCartItem);

router.post("/merge", verifyTokenMiddleware, mergerCart);

router.get("/vouchers", verifyTokenMiddleware, getAvailableVouchersHandler);
router.post("/apply-voucher", verifyTokenMiddleware, applyVoucherHandler);
router.post("/remove-voucher", verifyTokenMiddleware, removeVoucherHandler);

export default router;
