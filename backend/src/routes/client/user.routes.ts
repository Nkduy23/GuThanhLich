import { Router } from "express";
import { verifyTokenMiddleware } from "../../middlewares/verifyToken.middleware";
import { getProfile } from "../../controllers/client/user.controller";

const router = Router();

router.get("/profile", verifyTokenMiddleware, getProfile);

export default router;
