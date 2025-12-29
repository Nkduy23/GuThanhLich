// api/routes/client/orders.routes.ts (new - assume)
import { Router } from "express";
import { getUserOrders } from "../../controllers/client/orders.controller";
import { verifyTokenMiddleware } from "../../middlewares/verifyToken.middleware";

const router = Router();

router.get("/", verifyTokenMiddleware, getUserOrders);

export default router;
