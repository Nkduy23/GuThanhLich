import { Router } from "express";
import { verifyTokenMiddleware } from "../../middlewares/verifyToken.middleware";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  mergerCart,
} from "../../controllers/client/cart.controller";

const router = Router();

// Get cart
router.get("/", verifyTokenMiddleware, getCart);

// Add item
router.post("/add", verifyTokenMiddleware, addToCart);

// Update quantity/variant/size
router.put("/:id", verifyTokenMiddleware, updateCartItem); // Giữ :id, controller dùng req.params.id as cartItemId

// Remove item
router.delete("/:id", verifyTokenMiddleware, removeCartItem); // Giữ :id

// Merge cart
router.post("/merge", verifyTokenMiddleware, mergerCart);

export default router;
