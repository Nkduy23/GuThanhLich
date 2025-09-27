import { Router } from "express";
import { renderDashboard } from "../../controllers/admin/dashboard.controller";

const router = Router();

router.get("/", renderDashboard);

export default router;
