import { Router } from "express";
import { getCheckout } from "../../controllers/client/checkout.controller";

const router = Router();
router.get("/", getCheckout);

export default router;
