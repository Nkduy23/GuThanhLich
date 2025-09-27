import { Router } from "express";
import dashboardRouter from "./dashboard.routes";

const router = Router();

router.use("/", dashboardRouter);

export default router;
