import { Router } from "express";
import dashboardRouter from "./dashboard.routes";
import categoryRouter from "./category.routes";

const router = Router();

router.use("/", dashboardRouter);
router.use("/categories", categoryRouter);

export default router;
