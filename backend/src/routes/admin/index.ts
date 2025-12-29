import { Router } from "express";
import dashboardRouter from "./dashboard.routes";
import userRouter from "./auth.routes";
import categoryRouter from "./category.routes";
import productRouter from "./product.routes";
import ordersRouter from "./orders.routes";
import brandRouter from "./brand.routes";

const router = Router();

router.use("/", dashboardRouter);
router.use("/user", userRouter);
router.use("/categories", categoryRouter);
router.use("/products", productRouter);
router.use("/orders", ordersRouter);
router.use("/brands", brandRouter);

export default router;
