import { Router } from "express";
import { renderHome } from "../../controllers/client/home.controller";

const router = Router();

router.get("/", renderHome);

export default router;
