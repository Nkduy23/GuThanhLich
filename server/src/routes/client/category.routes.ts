import { Router } from "express";
import { getCategory } from "../../controllers/client/category.controller";

const router = Router();
router.get("/", getCategory);

export default router;
