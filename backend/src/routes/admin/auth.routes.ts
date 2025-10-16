import { Router } from "express";
import { verifyTokenMiddleware } from "../../middlewares/verifyToken.middleware";
import { requireAdmin } from "../../middlewares/checkRole.middleware";
import { validateRegister, adminValidateUpdate } from "../../middlewares/admin/auth.middleware";
import {
  createUser,
  getUsers,
  updateUser,
  removeUser,
} from "../../controllers/admin/user.controller";

const router = Router();

router.get("/", verifyTokenMiddleware, requireAdmin, getUsers);
router.post("/", verifyTokenMiddleware, requireAdmin, validateRegister, createUser);
router.put("/:id", verifyTokenMiddleware, requireAdmin, adminValidateUpdate, updateUser);
router.delete("/:id", verifyTokenMiddleware, requireAdmin, removeUser);

export default router;
