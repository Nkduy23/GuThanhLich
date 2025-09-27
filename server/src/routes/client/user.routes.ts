import { Router } from "express";
import { getProfile } from "../../controllers/client/user.controller";

const router = Router();

router.get("/profile", getProfile);

export default router;
