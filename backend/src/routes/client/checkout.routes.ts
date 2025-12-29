// client/checkout.routes.ts
import { Router } from "express";
import { getCheckout, createOrder } from "../../controllers/client/checkout.controller";
import { verifyTokenMiddleware } from "../../middlewares/verifyToken.middleware";

const router = Router();

router.get("/", verifyTokenMiddleware, getCheckout);

router.post("/", verifyTokenMiddleware, createOrder);

export default router;
