// import { Router } from "express";
// import { getProfile } from "../controllers/user.controller";

// const router = Router();

// router.get("/profile", getProfile);

// export default router;
import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  res.json([
    { id: 1, name: "Nguyễn Văn A", email: "vana@example.com", role: "customer" },
    { id: 2, name: "Trần Thị B", email: "thib@example.com", role: "customer" },
    { id: 3, name: "Admin C", email: "adminc@example.com", role: "admin" },
  ]);
});

export default router;
