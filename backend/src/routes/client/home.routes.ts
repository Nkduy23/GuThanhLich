import { Router } from "express";
import { getHomeData } from "../../controllers/client/home.controller";

const router = Router();

router.get("/", getHomeData);

export default router;
