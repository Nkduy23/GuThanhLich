import { Router } from "express";
import homeRouter from "./home.routes";
import authRouter from "./auth.routes";
import productRouter from "./product.routes";
import cartRouter from "./cart.routes";
import checkoutRouter from "./checkout.routes";
import userRouter from "./user.routes";
import reviewRouter from "./review.routes";
import brandRouter from "./brand.routers";

import { renderCategory, renderMenus } from "../../controllers/client/category.controller";

const router = Router();

router.use("/home", homeRouter);
router.use("/menus", renderMenus);
router.use("/auth", authRouter);
router.use("/products", productRouter);
router.use("/cart", cartRouter);
router.get("/category/:slug", renderCategory);
router.use("/checkout", checkoutRouter);
router.use("/reviews", reviewRouter);
router.use("/brand", brandRouter);
router.use("/user", userRouter);

export default router;
